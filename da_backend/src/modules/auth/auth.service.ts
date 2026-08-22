import { Jwt } from './../../../node_modules/.pnpm/@types+jsonwebtoken@9.0.10/node_modules/@types/jsonwebtoken/index.d';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSession } from './entities';
import { Repository } from 'typeorm';
import { JwtPayload, LoginDto, LoginResponse } from './dtos';
import { UsersService } from '../users/users.service';
import bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { UserResponse } from '../users/dtos';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserSession)
    private readonly userSessionRepo: Repository<UserSession>,
    private readonly userService: UsersService,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<LoginResponse> {
    const user = await this.userService.getByUsername(dto.username);
    if (!user)
      throw new BadRequestException(
        'Thông tin người dùng không đúng, vui lòng thử lại !',
      );
    const isValidPass = await bcrypt.compare(dto.password, user.password);
    if (!isValidPass)
      throw new BadRequestException(
        'Thông tin người dùng không đúng, vui lòng thử lại !',
      );
    const sessionId = randomUUID();

    const tokens = await this.generateTokens({
      sub: user.id,
      username: user.username,
      sid: sessionId,
    });
    const tokenHashed = await bcrypt.hash(tokens.refreshToken, 10);

    const session = this.userSessionRepo.create({
      userId: user.id,
      hashedToken: tokenHashed,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdBy: user.id,
    });
    await this.userSessionRepo.save(session);

    return {
      user: new UserResponse().mapToResponse(user),
      token: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        sessionId,
      },
    };
  }

  async logout(user: UserResponse, sessionId: string): Promise<UserResponse> {
    const currentSession = await this.userSessionRepo.findOne({
      where: { userId: user.id, sid: sessionId },
    });
    if (!currentSession)
      throw new BadRequestException(
        'Lỗi đăng xuất, hệ thống không ghi nhận phiên đăng nhập hiện tại !',
      );

    await this.userSessionRepo.remove(currentSession);
    return user;
  }

  async refresh(
    user: UserResponse,
    currentSessionId: string,
    refreshToken: string,
  ) {
    const now = new Date();
    const currentUserSession = await this.userSessionRepo.findOne({
      where: { userId: user.id, sid: currentSessionId },
    });
    if (!currentUserSession)
      throw new UnauthorizedException(
        'Phiên đăng nhập không tồn tại, vui lòng đăng nhập lại !',
      );

    if (now > currentUserSession.expiresAt) {
      throw new UnauthorizedException(
        'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại !',
      );
    }
    const checkToken = await bcrypt.compare(
      refreshToken,
      currentUserSession.hashedToken,
    );
    if (!checkToken)
      throw new UnauthorizedException(
        'Thông tin không hợp lệ, vui lòng đăng nhập lại hệ thống !',
      );
    if (!user.id || !user.username)
      throw new BadRequestException('Lỗi dữ liệu');
    const tokens = await this.generateTokens({
      sub: user.id,
      username: user.username,
      sid: currentSessionId,
    });
    const hashedToken = await bcrypt.hash(tokens.refreshToken, 10);

    const session = this.userSessionRepo.create({
      userId: user.id,
      hashedToken,
      sid: currentSessionId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await this.userSessionRepo.remove(currentUserSession);
    await this.userSessionRepo.save(session);

    return tokens;
  }

  async generateTokens(payload: JwtPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get<any>('JWT_ACCESS_EXPIRES_IN', '15m'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get<any>('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
