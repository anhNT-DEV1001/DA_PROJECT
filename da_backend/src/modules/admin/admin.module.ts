import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterData, Menu, Role } from './entites';
import {
  MasterDataController,
  MenuController,
  RoleController,
} from './controllers';
import { MasterDataService, MenuService, RoleService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Menu, MasterData])],
  controllers: [RoleController, MenuController, MasterDataController],
  providers: [RoleService, MenuService, MasterDataService],
  exports: [RoleService, MenuService, MasterDataService],
})
export class AdminModule {}
