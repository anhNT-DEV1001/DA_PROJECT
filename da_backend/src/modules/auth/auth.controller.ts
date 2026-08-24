import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { CurrentUser, Public } from 'src/common/decorators';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos';
import type { AuthUser, RefreshAuthUser } from './dtos';
import { JwtRefreshGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('login')
  @Public()
  async loginController(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(dto);
    this.setAuthCookies(
      response,
      result.token.accessToken,
      result.token.refreshToken,
    );
    return result;
  }

  @Post('logout')
  async logoutController(
    @CurrentUser() auth: AuthUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.logout(auth.user, auth.token.sessionId);

    response.clearCookie('accessToken', this.accessCookieOptions());
    response.clearCookie('refreshToken', this.refreshCookieOptions());
    return user;
  }

  @Post('refresh')
  @Public()
  @UseGuards(JwtRefreshGuard)
  async refreshController(
    @CurrentUser() auth: RefreshAuthUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = await this.authService.refresh(
      auth.user,
      auth.token.sessionId,
      auth.token.refreshToken,
    );

    this.setAuthCookies(response, tokens.accessToken, tokens.refreshToken);
    return tokens;
  }

  private setAuthCookies(
    response: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    response.cookie('accessToken', accessToken, this.accessCookieOptions());
    response.cookie('refreshToken', refreshToken, this.refreshCookieOptions());
  }

  private accessCookieOptions() {
    return {
      ...this.baseCookieOptions(),
      path: this.apiPath(),
    };
  }

  private refreshCookieOptions() {
    return {
      ...this.baseCookieOptions(),
      path: `${this.apiPath()}/auth/refresh`,
    };
  }

  private baseCookieOptions() {
    return {
      httpOnly: true,
      secure: this.config.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax' as const,
    };
  }

  private apiPath(): string {
    const prefix = this.config.get<string>('GLOBAL_PREFIX', 'api/v1');
    return `/${prefix.replace(/^\/+|\/+$/g, '')}`;
  }
}
