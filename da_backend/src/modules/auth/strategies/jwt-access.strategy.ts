import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UsersService } from 'src/modules/users/users.service';
import { AuthUser, JwtPayload } from '../dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/modules/admin/entites';
import { In, Repository } from 'typeorm';

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
    const accessToken = req.cookies?.accessToken ?? '';

    const user = await this.userService.getByIdWithRoles(payload.sub);
    if (!user) {
      throw new UnauthorizedException(
        'Người dùng không tồn tại hoặc đã bị khóa !',
      );
    }

    if (!user.userRoles) user.userRoles = [];
    const roleIds = user.userRoles.map((ur) => ur.roleId);

    const roles = await this.roleRepo.find({
      where: { id: In(roleIds) },
    });

    return {
      user,
      token: {
        accessToken,
        sessionId: payload.sid,
      },
      roles,
    };
  }
}
