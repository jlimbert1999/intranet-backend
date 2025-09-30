import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HeroSlideController } from './controllers';
import { HeroSlidesService } from './services';
import { HeroSlides } from './entities';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [TypeOrmModule.forFeature([HeroSlides]), FilesModule],
  controllers: [HeroSlideController],
  providers: [HeroSlidesService],
})
export class ContentModule {}
