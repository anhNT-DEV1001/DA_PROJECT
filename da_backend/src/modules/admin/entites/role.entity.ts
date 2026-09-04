import { BaseEntity } from 'src/database/entites';
import { UserRole } from '../../users/entities/user-role.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { RolePermission } from './role-permission.entity';

@Entity('roles')
export class Role extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  rolePermissions: RolePermission[];
}
