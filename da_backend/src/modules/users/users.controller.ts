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

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get(':id')
  async getUserById(@Param('id') id: number) {
    const response = await this.userService.getById(id);
    return response;
  }

  @Public()
  @Post()
  async createUserController(@Body() dto: CreateUserDto) {
    const response = await this.userService.createUser(dto);
    return response;
  }

  @Patch(':id')
  async updateUserController(
    @Param('id') id: number,
    @Body() dto: UpdateUserDto,
  ) {
    const resposne = await this.userService.updateUser(id, dto);
    return resposne;
  }

  @Delete(':id')
  async removeUserContoller(@Param('id') id: number) {
    const response = await this.userService.removeUser(id);
    return response;
  }
}
