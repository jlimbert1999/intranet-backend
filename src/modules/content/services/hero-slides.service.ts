import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { FilesService } from 'src/modules/files/files.service';
import { FileGroup } from 'src/modules/files/file-group.enum';
import { CreateHeroSlideDto } from '../dtos';
import { HeroSlides } from '../entities';

@Injectable()
export class HeroSlidesService {
  constructor(
    @InjectRepository(HeroSlides) private heroSlidesRepository: Repository<HeroSlides>,
    private dataSource: DataSource,
    private fileService: FilesService,
  ) {}

  async findAll() {
    const slides = await this.heroSlidesRepository.find({ order: { order: 'ASC' } });
    return slides.map(({ image, ...props }) => ({
      ...props,
      image: this.fileService.buildFileUrl(image, FileGroup.HERO_SLIDES),
    }));
  }

  async syncSlides({ slides }: CreateHeroSlideDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existing = await queryRunner.manager.find(HeroSlides);

      const incomingIds = slides.filter(({ id }) => id).map(({ id }) => id);

      const toDelete = existing.filter(({ id }) => !incomingIds.includes(id));

      if (toDelete.length > 0) {
        await queryRunner.manager.remove(toDelete);
      }

      const toSave = slides.map((slide) =>
        queryRunner.manager.create(HeroSlides, {
          id: slide.id,
          ...slide,
        }),
      );
      const result = await queryRunner.manager.save(toSave);
      await queryRunner.commitTransaction();

      return result;
    } catch (error: unknown) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(`Failed to create hero slides`);
    } finally {
      await queryRunner.release();
    }
  }
}
