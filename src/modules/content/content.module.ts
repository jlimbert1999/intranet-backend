import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HeroSlideController, QuickAccessController } from './controllers';
import { HeroSlidesService, QuickAccessService } from './services';
import { HeroSlides, QuickAccess } from './entities';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [TypeOrmModule.forFeature([HeroSlides, QuickAccess]), FilesModule],
  controllers: [HeroSlideController, QuickAccessController],
  providers: [HeroSlidesService, QuickAccessService],
  exports: [QuickAccessService],
})
export class ContentModule {}
