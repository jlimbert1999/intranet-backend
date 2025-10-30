import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { FilesService } from 'src/modules/files/files.service';
import { FileGroup } from 'src/modules/files/file-group.enum';
import { CreateQuickAccessDto } from '../dtos';
import { QuickAccess } from '../entities';

@Injectable()
export class QuickAccessService {
  constructor(
    @InjectRepository(QuickAccess) private quickAccessRepository: Repository<QuickAccess>,
    private fileService: FilesService,
    private dataSource: DataSource,
  ) {}

  async findAll() {
    const items = await this.quickAccessRepository.find({ order: { order: 'ASC' } });
    return items.map((item) => this.plainQuickAccess(item));
  }

  async syncItems({ items }: CreateQuickAccessDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.clear(QuickAccess);
      const models = items.map((item) => queryRunner.manager.create(QuickAccess, item));
      const result = await queryRunner.manager.save(models);
      await queryRunner.commitTransaction();
      return result.map((item) => this.plainQuickAccess(item));
    } catch (error: unknown) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(`Failed to sync quick access items`);
    } finally {
      await queryRunner.release();
    }
  }

  private plainQuickAccess(item: QuickAccess) {
    const { icon, ...props } = item;
    return { ...props, icon: icon ? this.fileService.buildFileUrl(icon, FileGroup.QUICK_ACCESS) : null };
  }
}
