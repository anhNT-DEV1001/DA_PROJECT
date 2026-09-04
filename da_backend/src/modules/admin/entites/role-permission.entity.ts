import { BaseEntity } from 'src/database/entites';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Role } from './role.entity';
import { Permission } from './permission.entity';

@Entity('role_permissions')
export class RolePermission extends BaseEntity {
  @Column({ name: 'role_id', type: 'int' })
  roleId: number;

  @ManyToOne(() => Role, (role) => role.rolePermissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ name: 'permission_id', type: 'int' })
  permissionId: number;

  @ManyToOne(() => Permission, (permission) => permission.rolePermissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;
}
