import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BasicTokenGuard, RefreshTokenGuard } from './guards/token.guard';
import { RegisterUserDto } from './dto/register-user.dto';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token/access')
  @PublicRoute()
  @UseGuards(RefreshTokenGuard)
  postTokenAccess(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    const issuedToken = this.authService.reissueToken(token, false);

    return {
      accessToken: issuedToken,
    };
  }

  @Post('token/refresh')
  @PublicRoute()
  @UseGuards(RefreshTokenGuard)
  postTokenRefresh(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    const issuedToken = this.authService.reissueToken(token, true);

    return {
      refreshToken: issuedToken,
    };
  }

  @Post('login/email')
  @PublicRoute()
  @UseGuards(BasicTokenGuard)
  postLoginEmail(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, false);
    const credentials = this.authService.decodeBasicToken(token);

    return this.authService.loginWithEmail(credentials);
  }

  @Post('register/email')
  @PublicRoute()
  postRegisterEmail(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerWithEmail(registerUserDto);
  }
}
