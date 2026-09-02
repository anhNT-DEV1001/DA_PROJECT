import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiCookieAuth, ApiOperation } from '@nestjs/swagger';
import type { Response } from 'express';
import { CurrentUser, Public } from 'src/common/decorators';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos';
import type { AuthUser, RefreshAuthUser } from './dtos';
import { JwtRefreshGuard } from './guards';
import { clearAuthCookies, setAuthCookies } from 'src/common/utils';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('login')
  @ApiOperation({
    summary: 'Đăng nhập và tạo access/refresh token cookies',
    security: [],
  })
  @Public()
  async loginController(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(dto);
    setAuthCookies(
      response,
      result.token.accessToken,
      result.token.refreshToken,
      this.config,
    );
    return result;
  }

  @Post('logout')
  @ApiCookieAuth('access-token-cookie')
  @ApiOperation({ summary: 'Đăng xuất và xoá phiên đăng nhập hiện tại' })
  async logoutController(
    @CurrentUser() auth: AuthUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.logout(auth.user, auth.token.sessionId);

    clearAuthCookies(response, this.config);
    return user;
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Luân chuyển refresh token và cấp cặp token mới',
    security: [{ 'refresh-token-cookie': [] }],
  })
  @ApiCookieAuth('refresh-token-cookie')
  @UseGuards(JwtRefreshGuard)
  @Public()
  async refreshController(
    @CurrentUser() auth: RefreshAuthUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = await this.authService.refresh(
      auth.user,
      auth.token.sessionId,
      auth.token.refreshToken,
    );

    setAuthCookies(
      response,
      tokens.accessToken,
      tokens.refreshToken,
      this.config,
    );
    return tokens;
  }
}
