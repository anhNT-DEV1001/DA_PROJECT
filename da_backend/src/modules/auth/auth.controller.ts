import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiExtraModels,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { CurrentUser, Public, ResponseMessage } from 'src/common/decorators';
import { createMulterOptions } from 'src/common/utils/multer.util';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dtos';
import type { AuthUser, RefreshAuthUser } from './dtos';
import { JwtRefreshGuard } from './guards';
import { clearAuthCookies, setAuthCookies } from 'src/common/utils';

const avatarUploadOptions = createMulterOptions({
  folder: 'avatars',
  allowedTypes: ['image'],
});

@ApiTags('Auth')
@ApiExtraModels(RegisterDto)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('register')
  @ApiOperation({
    summary: 'Đăng ký tài khoản người dùng',
    security: [],
  })
  @Public()
  @ResponseMessage('Đăng ký tài khoản thành công')
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiBody({
    schema: {
      allOf: [
        { $ref: getSchemaPath(RegisterDto) },
        {
          type: 'object',
          properties: {
            avatar: { type: 'string', format: 'binary' },
          },
        },
      ],
    },
  })
  @UseInterceptors(FileInterceptor('avatar', avatarUploadOptions))
  async registerController(
    @Body() dto: RegisterDto,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    const response = await this.authService.register(dto, avatar);
    return response;
  }

  @Post('login')
  @ApiOperation({
    summary: 'Đăng nhập và tạo access/refresh token cookies',
    security: [],
  })
  @Public()
  @ResponseMessage('Đăng nhập thành công')
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

  @Get('me')
  @ApiCookieAuth('access-token-cookie')
  @ApiOperation({
    summary: 'Lấy thông tin người dùng đang đăng nhập kèm roles và permissions',
  })
  getMeController(@CurrentUser() auth: AuthUser) {
    return auth;
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
