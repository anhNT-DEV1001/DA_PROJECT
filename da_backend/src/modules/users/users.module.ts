import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserRole } from './entities';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Role } from '../admin/entites';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole, Role])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
