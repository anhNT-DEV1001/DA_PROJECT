import { SoftDeleteEntity } from 'src/database/entites';
import { Column, Entity, OneToMany } from 'typeorm';
import { UserSession } from '../../auth/entities/user-session.entity';
import { UserRole } from './user-role.entity';

@Entity('users')
export class User extends SoftDeleteEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  username: string;
  @Column({ type: 'varchar', length: 100 })
  password: string;
  @Column({ type: 'varchar', length: 255, name: 'full_name' })
  fullName: string;
  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  email: string | null;
  @Column({ type: 'varchar', length: 20, nullable: true, unique: true })
  phone: string | null;
  @Column({ type: 'varchar', length: 20, nullable: true })
  gender: string | null;
  @Column({ type: 'varchar', nullable: true, length: 255 })
  avatar: string | null;
  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string | null;
  @Column({ type: 'date', nullable: true })
  dob: Date | null;
  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];

  @OneToMany(() => UserSession, (session) => session.user)
  sessions: UserSession[];
}
