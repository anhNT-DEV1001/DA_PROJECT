import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserPermission, UserRole } from './entities';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Role } from '../admin/entites';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole, UserPermission, Role])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
