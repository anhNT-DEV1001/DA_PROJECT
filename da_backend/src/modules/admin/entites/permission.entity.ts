import { BaseEntity } from 'src/database/entites';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Menu } from './menu.entity';
import { RolePermission } from './role-permission.entity';
import { UserPermission } from '../../users/entities/user-permission';

@Entity('permissions')
export class Permission extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  action: string;

  @Column({ name: 'menu_id', type: 'int' })
  menuId: number;

  @ManyToOne(() => Menu, (menu) => menu.permissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menu_id' })
  menu: Menu;

  @Column({ type: 'varchar', length: 255, unique: true })
  code: string;

  @OneToMany(
    () => RolePermission,
    (rolePermission) => rolePermission.permission,
  )
  rolePermissions: RolePermission[];

  @OneToMany(
    () => UserPermission,
    (userPermission) => userPermission.permission,
  )
  userPermissions: UserPermission[];
}
