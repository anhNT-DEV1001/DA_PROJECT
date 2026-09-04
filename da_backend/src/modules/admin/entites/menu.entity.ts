import { BaseEntity } from 'src/database/entites';
import { Entity } from 'typeorm';

@Entity('menus')
export class Menu extends BaseEntity {
  name: string;
  route: string;
  alias: string;
  parentId: number | null;
  displayOrder: number;
}
