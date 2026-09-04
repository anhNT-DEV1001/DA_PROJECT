import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UsersService } from 'src/modules/users/users.service';
import { AuthUser, JwtPayload } from '../dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/modules/admin/entites';
import { In, Repository } from 'typeorm';
import { UserSession } from '../entities';
import { AuthorizeService } from 'src/modules/admin/services';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    private readonly config: ConfigService,
    private readonly userService: UsersService,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(UserSession)
    private readonly userSessionRepo: Repository<UserSession>,
    private readonly authorizeService: AuthorizeService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.accessToken ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<AuthUser> {
    const accessToken = req.cookies?.accessToken;
    if (typeof accessToken !== 'string' || !payload.sub || !payload.sid) {
      throw new UnauthorizedException(
        'Thông tin xác thực không hợp lệ. Vui lòng đăng nhập lại.',
      );
    }

    const [user, session] = await Promise.all([
      this.userService.getByIdWithRoles(payload.sub),
      this.userSessionRepo.findOne({
        where: {
          userId: payload.sub,
          sid: payload.sid,
        },
      }),
    ]);

    const sessionExpiresAt = session
      ? new Date(session.expiresAt).getTime()
      : Number.NaN;
    if (
      !session ||
      !Number.isFinite(sessionExpiresAt) ||
      sessionExpiresAt <= Date.now()
    ) {
      throw new UnauthorizedException(
        'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
      );
    }

    if (!user) {
      throw new UnauthorizedException(
        'Người dùng không tồn tại hoặc đã bị khóa !',
      );
    }

    if (!user.userRoles) user.userRoles = [];
    const roleIds = user.userRoles.map((ur) => ur.roleId);
    if (!user.id) throw new BadRequestException('Lỗi dữ liệu');
    const [roles, permissions] = await Promise.all([
      this.roleRepo.find({
        where: { id: In(roleIds) },
      }),
      this.authorizeService.getUserPermission(user.id),
    ]);

    return {
      user,
      token: {
        accessToken,
        sessionId: payload.sid,
      },
      roles,
      permissions,
    };
  }
}
