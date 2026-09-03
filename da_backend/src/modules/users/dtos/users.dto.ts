import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { User } from '../entities';

export class CreateUserDto {
  @ApiProperty({ example: 'nguyenvana' })
  @IsString({ message: 'Tên đăng nhập phải là chuỗi ký tự.' })
  @IsNotEmpty({ message: 'Vui lòng nhập tên đăng nhập.' })
  @MaxLength(255, { message: 'Tên đăng nhập không được vượt quá 255 ký tự.' })
  username: string;

  @ApiProperty({ example: 'Password@123' })
  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự.' })
  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu.' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' })
  @MaxLength(100, { message: 'Mật khẩu không được vượt quá 100 ký tự.' })
  password: string;

  @ApiProperty({ example: 'Password@123' })
  @IsString({ message: 'Mật khẩu xác nhận phải là chuỗi ký tự.' })
  @IsNotEmpty({ message: 'Vui lòng nhập lại mật khẩu.' })
  @MinLength(6, { message: 'Mật khẩu xác nhận phải có ít nhất 6 ký tự.' })
  @MaxLength(100, {
    message: 'Mật khẩu xác nhận không được vượt quá 100 ký tự.',
  })
  passwordConfirm: string;

  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString({ message: 'Họ và tên phải là chuỗi ký tự.' })
  @IsNotEmpty({ message: 'Vui lòng nhập họ và tên.' })
  @MaxLength(255, { message: 'Họ và tên không được vượt quá 255 ký tự.' })
  fullName: string;

  @ApiProperty({ example: 'nguyenvana@example.com' })
  @IsString({ message: 'Email phải là chuỗi ký tự.' })
  @IsNotEmpty({ message: 'Vui lòng nhập email.' })
  @IsEmail({}, { message: 'Email không đúng định dạng.' })
  @MaxLength(255, { message: 'Email không được vượt quá 255 ký tự.' })
  email: string;

  @ApiProperty({ example: '0912345678' })
  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự.' })
  @IsNotEmpty({ message: 'Vui lòng nhập số điện thoại.' })
  @MaxLength(20, { message: 'Số điện thoại không được vượt quá 20 ký tự.' })
  phone: string;

  @ApiProperty({ example: 'Nam' })
  @IsString({ message: 'Giới tính phải là chuỗi ký tự.' })
  @IsNotEmpty({ message: 'Vui lòng chọn giới tính.' })
  @MaxLength(20, { message: 'Giới tính không được vượt quá 20 ký tự.' })
  gender: string;

  @ApiProperty({ example: [1, 2], type: [Number] })
  @IsArray({ message: 'Danh sách vai trò phải là một mảng.' })
  @ArrayUnique({ message: 'Danh sách vai trò không được trùng lặp.' })
  @IsInt({ each: true, message: 'Mỗi mã vai trò phải là số nguyên.' })
  @Min(1, { each: true, message: 'Mỗi mã vai trò phải lớn hơn 0.' })
  roleIds: number[];

  @IsOptional()
  @IsString({ message: 'Địa chỉ phải là chuỗi ký tự.' })
  @MaxLength(255, { message: 'Địa chỉ không được vượt quá 255 ký tự.' })
  address?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày sinh phải là chuỗi ngày hợp lệ.' })
  dob?: Date;
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
