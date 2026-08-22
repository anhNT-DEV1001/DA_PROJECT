import { UsersModule } from './../users/users.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSession } from './entities';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([UserSession]),
    JwtModule.register({}),
  ],
  controllers: [],
  providers: [],
})
export class AuthModule {}
