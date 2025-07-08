import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { VerifiedToken } from './types/auth.types';
import { RegisterUserDto } from './dto/register-user.dto';
import { ConfigService } from '@nestjs/config';
import { EnvKeys } from 'src/common/constants/env.const';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  extractTokenFromHeader(header: string, isBearer: boolean) {
    const splitted = header.split(' ');
    const prefix = isBearer ? 'Bearer' : 'Basic';

    if (splitted.length !== 2 || splitted[0] !== prefix) {
      throw new UnauthorizedException('Invalid format of token');
    }

    return splitted[1];
  }

  decodeBasicToken(base64String: string) {
    const decoded = Buffer.from(base64String, 'base64').toString('utf8');
    const splitted = decoded.split(':');

    if (splitted.length !== 2) {
      throw new UnauthorizedException('Invalid format of token');
    }

    const [email, password] = splitted;

    return { email, password };
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get(EnvKeys.JWT_SECRET),
      });
    } catch (error) {
      throw new UnauthorizedException('Token is invalid or expired.', {
        cause: error,
      });
    }
  }

  reissueToken(token: string, isRefreshToken: boolean) {
    const decoded = this.jwtService.verify<VerifiedToken>(token, {
      secret: this.configService.get(EnvKeys.JWT_SECRET),
    });

    if (decoded.type !== 'refresh') {
      throw new UnauthorizedException(
        'Only refresh token is accepted to reissue token.',
      );
    }

    return this.signToken(
      {
        id: decoded.sub,
        email: decoded.email,
      },
      isRefreshToken,
    );
  }

  /**
   * @payload
   * 1) email
   * 2) sub(=id)
   * 3) type: 'access' | 'refresh'
   */
  signToken(user: Pick<UserModel, 'id' | 'email'>, isRefreshToken: boolean) {
    const payload: VerifiedToken = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get(EnvKeys.JWT_SECRET),
      expiresIn: isRefreshToken ? 3600 : 300,
    });
  }

  loginUser(user: Pick<UserModel, 'id' | 'email'>) {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true),
    };
  }

  async authenticateWithEmailAndPassword(
    user: Pick<UserModel, 'email' | 'password'>,
  ) {
    const matchedUser = await this.usersService.getUserByEmail(user.email);

    if (!matchedUser) {
      throw new UnauthorizedException('No matched user found.');
    }

    const passed = await bcrypt.compare(user.password, matchedUser.password);

    if (!passed) {
      throw new UnauthorizedException('Wrong password.');
    }

    return matchedUser;
  }

  async loginWithEmail(user: Pick<UserModel, 'email' | 'password'>) {
    const matchedUser = await this.authenticateWithEmailAndPassword(user);

    return this.loginUser(matchedUser);
  }

  async registerWithEmail(user: RegisterUserDto) {
    const hashed = await bcrypt.hash(
      user.password,
      parseInt(this.configService.get(EnvKeys.HASH_ROUNDS)),
    );
    const createdUser = await this.usersService.createUser({
      ...user,
      password: hashed,
    });

    return this.loginUser(createdUser);
  }
}
