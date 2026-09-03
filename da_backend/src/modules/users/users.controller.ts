import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { Public } from 'src/common/decorators';
import { createMulterOptions } from 'src/common/utils/multer.util';
import {
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiExtraModels,
  getSchemaPath,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

const avatarUploadOptions = createMulterOptions({
  folder: 'avatars',
  allowedTypes: ['image'],
});

@ApiTags('Users')
@ApiCookieAuth('access-token-cookie')
@ApiExtraModels(CreateUserDto, UpdateUserDto)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin người dùng' })
  @ApiParam({ name: 'id', example: 1, type: Number })
  async getUserById(@Param('id') id: number) {
    const response = await this.userService.getById(id);
    return response;
  }

  @ApiOperation({ summary: 'Đăng ký người dùng', security: [] })
  @Public()
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      allOf: [
        { $ref: getSchemaPath(CreateUserDto) },
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
  async createUserController(
    @Body() dto: CreateUserDto,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    const userData = avatar
      ? { ...dto, avatar: `/uploads/avatars/${avatar.filename}` }
      : dto;
    const response = await this.userService.createUser(userData);
    return response;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật người dùng' })
  @ApiParam({ name: 'id', example: 1, type: Number })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      allOf: [
        { $ref: getSchemaPath(UpdateUserDto) },
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
  async updateUserController(
    @Param('id') id: number,
    @Body() dto: UpdateUserDto,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    const userData = avatar
      ? { ...dto, avatar: `/uploads/avatars/${avatar.filename}` }
      : dto;
    const response = await this.userService.updateUser(id, userData);
    return response;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa người dùng' })
  @ApiParam({ name: 'id', example: 1, type: Number })
  async removeUserContoller(@Param('id') id: number) {
    const response = await this.userService.removeUser(id);
    return response;
  }
}
