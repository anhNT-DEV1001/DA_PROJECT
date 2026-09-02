import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { Public } from 'src/common/decorators';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiCookieAuth('access-token-cookie')
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
  async createUserController(@Body() dto: CreateUserDto) {
    const response = await this.userService.createUser(dto);
    return response;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật người dùng' })
  @ApiParam({ name: 'id', example: 1, type: Number })
  async updateUserController(
    @Param('id') id: number,
    @Body() dto: UpdateUserDto,
  ) {
    const resposne = await this.userService.updateUser(id, dto);
    return resposne;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa người dùng' })
  @ApiParam({ name: 'id', example: 1, type: Number })
  async removeUserContoller(@Param('id') id: number) {
    const response = await this.userService.removeUser(id);
    return response;
  }
}
