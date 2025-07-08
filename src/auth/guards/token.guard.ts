import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';
import { WsException } from '@nestjs/websockets';
import { Reflector } from '@nestjs/core';
import { PUBLIC_ROUTE_KEY } from 'src/common/decorators/public-route.decorator';

@Injectable()
export class BasicTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const rawToken = req.headers['authorization'];

    if (!rawToken) {
      throw new UnauthorizedException('Token not found.');
    }

    const token = this.authService.extractTokenFromHeader(rawToken, false);
    const { email, password } = this.authService.decodeBasicToken(token);
    const user = await this.authService.authenticateWithEmailAndPassword({
      email,
      password,
    });

    req.user = user; // 왜 이 구문이 필요한가?

    return true;
  }
}

@Injectable()
export class BearerTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublicRoute = this.reflector.getAllAndOverride(PUBLIC_ROUTE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const req = context.switchToHttp().getRequest();

    if (isPublicRoute) {
      req.isPublicRoute = true;

      return true;
    }

    const rawToken = req.headers['authorization'];

    if (!rawToken) {
      throw new UnauthorizedException('Token not found.');
    }

    const token = this.authService.extractTokenFromHeader(rawToken, true);
    const result = await this.authService.verifyToken(token);
    const user = await this.usersService.getUserByEmail(result.email);

    req.token = token;
    req.tokenType = result.type;
    req.user = user;

    return true;
  }
}

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const req = context.switchToHttp().getRequest();

    if (req.isPublicRoute) {
      return true;
    }

    if (req.tokenType !== 'access') {
      throw new UnauthorizedException('No access token');
    }

    return true;
  }
}

@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const req = context.switchToHttp().getRequest();

    if (req.isPublicRoute) {
      return true;
    }

    if (req.tokenType !== 'refresh') {
      throw new UnauthorizedException('No refresh token');
    }

    return true;
  }
}

@Injectable()
export class SocketBearerTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const socket = context.switchToWs().getClient();
    const headers = socket.handshake.headers;
    const rawToken = headers['authorization'];

    if (!rawToken) {
      throw new WsException('Token not found.');
    }

    try {
      const token = this.authService.extractTokenFromHeader(rawToken, true);
      const payload = this.authService.verifyToken(token);
      const user = await this.usersService.getUserByEmail(payload.email);

      socket.user = user;
      socket.token = token;
      socket.tokeyType = payload.tokenType;

      return true;
    } catch (e) {
      throw new WsException(`Token is not valid. Error: ${e.message}`);
    }
  }
}
