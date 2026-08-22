import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RoleService } from '../services';
import { RoleDto } from '../dtos';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async getListController() {
    const data = await this.roleService.getListRole();
    return data;
  }

  @Get(':id')
  async getByIdController(@Param('id') id: number) {
    const response = await this.roleService.getById(id);
    return response;
  }

  @Post()
  async createRole(@Body() dto: RoleDto) {
    const response = await this.roleService.saveRole(dto);
    return response;
  }

  @Patch(':id')
  async updateRoleController(@Param('id') id: number, @Body() dto: RoleDto) {
    const response = await this.roleService.saveRole(dto, id);
    return response;
  }

  @Delete(':id')
  async removeRoleController(@Param('id') id: number) {
    const response = await this.roleService.removeRole(id);
    return response;
  }
}
