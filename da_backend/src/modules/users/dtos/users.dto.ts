import { OmitType, PartialType } from '@nestjs/swagger';
import { User } from '../entities';

export class CreateUserDto {
  username: string;
  password: string;
  passwordConfirm: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  roleIds: number[];
}

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'passwordConfirm', 'username'] as const),
) {}

export class UserResponse extends PartialType(
  OmitType(User, ['password', 'sessions'] as const),
) {
  mapToResponse(user: User): UserResponse {
    const { password, ...userResponse } = user;
    // const roleIds = user.userRoles?.map((ur) => ur.roleId) || [];
    return Object.assign(new UserResponse(), userResponse);
  }
}
