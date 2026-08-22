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

export class UserResponse extends PartialType(OmitType(User, ['password'])) {
  roleIds?: number[];

  mapToResponse(user: User, roleIds?: number[]): UserResponse {
    const response: Partial<User> = { ...user };
    delete response.password;
    return Object.assign(new UserResponse(), response, { roleIds });
  }
}
