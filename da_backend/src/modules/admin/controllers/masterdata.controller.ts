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
import { MasterDataDto } from '../dtos';
import { MasterDataService } from '../services';

@ApiTags('Master Data')
@ApiCookieAuth('access-token-cookie')
@Controller('master-data')
export class MasterDataController {
  constructor(private readonly masterDataService: MasterDataService) {}

  @Get(':group')
  @ApiOperation({ summary: 'Lấy danh sách master data theo nhóm' })
  @ApiParam({ name: 'group', example: 'GENDER', type: String })
  async getMasterDataByGroup(@Param('group') group: string) {
    return this.masterDataService.getMasterDataByGroup(group);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo master data' })
  async createMasterData(
    @Body() dto: MasterDataDto,
    @CurrentUser('user') user: UserResponse,
  ) {
    return this.masterDataService.saveMasterData(dto, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật master data' })
  @ApiParam({ name: 'id', example: 1, type: Number })
  async updateMasterData(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: MasterDataDto,
    @CurrentUser('user') user: UserResponse,
  ) {
    return this.masterDataService.saveMasterData(dto, user, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa master data' })
  @ApiParam({ name: 'id', example: 1, type: Number })
  async removeMasterData(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('user') user: UserResponse,
  ) {
    return this.masterDataService.removeMasterData(id, user);
  }
}
