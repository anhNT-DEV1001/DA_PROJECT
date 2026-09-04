import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterData, Menu, Permission, Role, RolePermission } from './entites';
import {
  MasterDataController,
  MenuController,
  RoleController,
} from './controllers';
import {
  AuthorizeService,
  MasterDataService,
  MenuService,
  RoleService,
} from './services';

import { UsersModule } from '../users/users.module';
import { PermissionGuard } from './guards';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Role,
      Menu,
      MasterData,
      Permission,
      RolePermission,
    ]),
    UsersModule,
  ],
  controllers: [RoleController, MenuController, MasterDataController],
  providers: [
    RoleService,
    MenuService,
    MasterDataService,
    AuthorizeService,
    PermissionGuard,
  ],
  exports: [
    RoleService,
    MenuService,
    MasterDataService,
    AuthorizeService,
    PermissionGuard,
  ],
})
export class AdminModule {}
