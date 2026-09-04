import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from '../entites';
import { FindOptionsWhere, IsNull, Not, Repository } from 'typeorm';
import { MenuDto } from '../dtos';
import { UserResponse } from 'src/modules/users/dtos';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  async getSidebarMenus(): Promise<Menu[]> {
    const menus = await this.menuRepository.find({
      where: { isActive: true, isSideBarDisplay: true, parentId: IsNull() },
      relations: {
        children: true,
      },
    });
    return menus;
  }

  async getListMenus(): Promise<Menu[]> {
    const menus = await this.menuRepository.find({
      where: { isActive: true, parentId: IsNull() },
      relations: {
        children: true,
      },
    });
    return menus;
  }

  async getMenuById(id: number) {
    const menu = await this.menuRepository.findOne({
      where: { id },
      relations: {
        children: true,
      },
    });
    return menu;
  }

  async saveMenu(dto: MenuDto, user: UserResponse, id?: number): Promise<Menu> {
    let menuData;
    // validate
    const whereCondidtion: FindOptionsWhere<Menu>[] = [{ alias: dto.alias }];
    if (id) {
      whereCondidtion.push({ id: Not(id) });
      const existMenu = await this.menuRepository.findOne({ where: { id } });
      if (!existMenu) throw new BadRequestException('Menu không tồn tại.');
      existMenu.updatedBy = user.id ? user.id : null;
      menuData = this.menuRepository.merge(existMenu, dto);
    } else {
      menuData = this.menuRepository.create({
        ...dto,
        createdBy: user.id,
        updatedBy: user.id,
      });
    }
    const validate = await this.menuRepository.exists({
      where: whereCondidtion,
    });
    if (validate)
      throw new BadRequestException('Thông tin menu đã tồn tại trên hệ thống');
    const response = await this.menuRepository.save(menuData);

    return response;
  }

  async removeMenu(id: number, user: UserResponse) {
    const menu = await this.menuRepository.findOne({ where: { id } });
    if (!menu) {
      throw new BadRequestException('Menu không tồn tại.');
    }
    return this.menuRepository.remove(menu);
  }
}
