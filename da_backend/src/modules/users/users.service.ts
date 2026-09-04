import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { FindOptionsWhere, In, Not, Repository } from 'typeorm';
import { Role } from '../admin/entites';
import { CreateUserDto, UpdateUserDto, UserResponse } from './dtos';
import { User, UserRole } from './entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(UserRole)
    private readonly userRoleRepo: Repository<UserRole>,
  ) {}

  async createUser(dto: CreateUserDto): Promise<UserResponse> {
    return this.userRepo.manager.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const userRoleRepo = manager.getRepository(UserRole);
      const roleRepo = manager.getRepository(Role);
      const { password, passwordConfirm, roleIds, ...userData } = dto;

      if (password !== passwordConfirm)
        throw new BadRequestException(
          'Mật khẩu nhập lại không khớp, vui lòng nhập lại !',
        );

      const whereCondition: FindOptionsWhere<User>[] = [
        { username: dto.username },
      ];
      if (dto.email) whereCondition.push({ email: dto.email });
      if (dto.phone) whereCondition.push({ phone: dto.phone });
      if (await userRepo.exists({ where: whereCondition }))
        throw new BadRequestException(
          'Thông tin người dùng đã tồn tại, vui lòng thử lại sau !',
        );

      const validRoleIds = await this.validateRoleIds(roleRepo, roleIds);
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = userRepo.create({
        password: hashedPassword,
        ...userData,
      });
      await userRepo.save(user);

      if (validRoleIds.length) {
        const userRoles = userRoleRepo.create(
          validRoleIds.map((roleId) => ({ roleId, userId: user.id })),
        );
        await userRoleRepo.save(userRoles);
      }

      return new UserResponse().mapToResponse(user);
    });
  }

  async updateUser(id: number, dto: UpdateUserDto): Promise<UserResponse> {
    return this.userRepo.manager.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const userRoleRepo = manager.getRepository(UserRole);
      const roleRepo = manager.getRepository(Role);
      const { roleIds, ...userData } = dto;

      const existUser = await userRepo.findOne({ where: { id } });
      if (!existUser)
        throw new BadRequestException(
          'Người dùng không tồn tại, vui lòng thử lại !',
        );

      const whereCondition: FindOptionsWhere<User>[] = [];
      if (dto.email) whereCondition.push({ email: dto.email, id: Not(id) });
      if (dto.phone) whereCondition.push({ phone: dto.phone, id: Not(id) });
      if (
        whereCondition.length &&
        (await userRepo.exists({ where: whereCondition }))
      )
        throw new BadRequestException(
          'Thông tin người dùng đã tồn tại trên hệ thống, vui lòng thử lại',
        );
      const validRoleIds =
        roleIds === undefined
          ? undefined
          : await this.validateRoleIds(roleRepo, roleIds);

      const user = userRepo.merge(existUser, userData);
      await userRepo.save(user);

      if (validRoleIds !== undefined) {
        await userRoleRepo.delete({ userId: user.id });
        if (validRoleIds.length) {
          const userRoles = userRoleRepo.create(
            validRoleIds.map((roleId) => ({ roleId, userId: user.id })),
          );
          await userRoleRepo.save(userRoles);
        }
      }
      return new UserResponse().mapToResponse(user);
    });
  }

  async removeUser(id: number): Promise<UserResponse> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new BadRequestException('Người dùng không tồn tại !');

    await this.userRepo.softRemove(user);
    return new UserResponse().mapToResponse(user);
  }

  async getById(id: number): Promise<UserResponse> {
    const user = await this.getByIdWithRoles(id);
    if (!user) throw new BadRequestException('Người dùng không tồn tại !');

    return user;
  }

  async getByIdWithRoles(id: number): Promise<UserResponse | null> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: {
        userRoles: {
          role: true,
        },
      },
    });
    if (!user) return null;
    return new UserResponse().mapToResponse(user);
  }

  async getByUsername(username: string): Promise<User | null> {
    const user = await this.userRepo.findOne({
      where: { username },
      relations: {
        userRoles: {
          role: true,
        },
      },
    });
    return user;
  }
  private async validateRoleIds(
    roleRepo: Repository<Role>,
    roleIds: number[],
  ): Promise<number[]> {
    if (
      !Array.isArray(roleIds) ||
      roleIds.some((roleId) => !Number.isInteger(roleId) || roleId <= 0)
    )
      throw new BadRequestException('Danh sách quyền không hợp lệ !');

    const uniqueRoleIds = [...new Set(roleIds)];
    if (!uniqueRoleIds.length) return uniqueRoleIds;

    const roleCount = await roleRepo.countBy({ id: In(uniqueRoleIds) });
    if (roleCount !== uniqueRoleIds.length)
      throw new BadRequestException(
        'Một hoặc nhiều quyền không tồn tại trong hệ thống !',
      );

    return uniqueRoleIds;
  }
}
