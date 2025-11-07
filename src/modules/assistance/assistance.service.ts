import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTutorialDto } from './dtos/tutorial.dto';
import { Tutorial, TutorialVideo } from './entities';
import { FilesService } from '../files/files.service';
import { FileGroup } from '../files/file-group.enum';

@Injectable()
export class AssistanceService {
  constructor(
    @InjectRepository(Tutorial) private tutorialRepository: Repository<Tutorial>,
    @InjectRepository(TutorialVideo) private videoRepository: Repository<TutorialVideo>,
    private fileService: FilesService,
  ) {}

  async create(dto: CreateTutorialDto) {
    const { videos, ...props } = dto;

    const model = this.tutorialRepository.create({
      ...props,
      videos: videos.map((video) => this.videoRepository.create(video)),
    });

    const tutorial = await this.tutorialRepository.save(model);

    return this.plainTutorial(tutorial);
  }

  async findAll() {
    return { tutorials: [], total: 0 };
  }

  private plainTutorial(tutorial: Tutorial) {
    const { videos, ...rest } = tutorial;
    return {
      videos: videos.map(({ fileName, thumbnailName, ...proos }) => ({
        ...proos,
        fileUrl: this.fileService.buildFileUrl(fileName, FileGroup.ASSISTANCE),
        thumbnailUrl: thumbnailName ? this.fileService.buildFileUrl(thumbnailName, FileGroup.ASSISTANCE) : null,
      })),
      ...rest,
    };
  }
}
