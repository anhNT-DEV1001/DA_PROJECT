import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MasterData } from '../entites';
import { FindOptionsWhere, Not, Repository } from 'typeorm';
import { MasterDataDto } from '../dtos';
import { UserResponse } from 'src/modules/users/dtos';

@Injectable()
export class MasterDataService {
  constructor(
    @InjectRepository(MasterData)
    private readonly masterDataRepo: Repository<MasterData>,
  ) {}

  async getMasterDataByGroup(group: string) {
    const masterData = await this.masterDataRepo.find({
      where: { group },
    });
    if (!masterData) throw new BadRequestException('Master Data không tồn tại');
    return masterData;
  }

  async saveMasterData(dto: MasterDataDto, user: UserResponse, id?: number) {
    let masterData;
    const whereCondition: FindOptionsWhere<MasterData>[] = [];
    if (id) {
      whereCondition.push({ id: Not(id) });
      const existMasterData = await this.masterDataRepo.findOne({
        where: { id },
      });
      if (!existMasterData)
        throw new BadRequestException('Master Data không tồn tại !');
      existMasterData.updatedBy = user.id ? user.id : null;
      masterData = this.masterDataRepo.merge(existMasterData, dto);
    } else
      masterData = this.masterDataRepo.create({
        ...dto,
        createdBy: user.id,
        updatedBy: user.id,
      });

    const response = await this.masterDataRepo.save(masterData);

    return response;
  }

  async removeMasterData(id: number, user: UserResponse) {
    const masterData = await this.masterDataRepo.findOne({ where: { id } });
    if (!masterData)
      throw new BadRequestException('Master Data không tồn tại !');
    masterData.deletedBy = user.id ? user.id : null;
    return await this.masterDataRepo.softRemove(masterData);
  }
}
