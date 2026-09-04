import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { UserResponse } from 'src/modules/users/dtos';
import { MenuDto } from '../dtos';
import { MenuService } from '../services';

@ApiTags('Menus')
@ApiCookieAuth('access-token-cookie')
@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get('sidebar')
  @ApiOperation({ summary: 'Lấy danh sách menu hiển thị trên sidebar' })
  async getSidebarMenus() {
    return this.menuService.getSidebarMenus();
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách menu' })
  async getListMenus() {
    return this.menuService.getListMenus();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin menu' })
  @ApiParam({ name: 'id', example: 1, type: Number })
  async getMenuById(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.getMenuById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo menu' })
  async createMenu(
    @Body() dto: MenuDto,
    @CurrentUser('user') user: UserResponse,
  ) {
    return this.menuService.saveMenu(dto, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật menu' })
  @ApiParam({ name: 'id', example: 1, type: Number })
  async updateMenu(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: MenuDto,
    @CurrentUser('user') user: UserResponse,
  ) {
    return this.menuService.saveMenu(dto, user, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa menu' })
  @ApiParam({ name: 'id', example: 1, type: Number })
  async removeMenu(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('user') user: UserResponse,
  ) {
    return this.menuService.removeMenu(id, user);
  }
}
