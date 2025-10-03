import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunicationsService } from './communications.service';
import { CommunicationsController } from './communications.controller';
import { Communication } from './entities/communication.entity';

import { FilesModule } from 'src/modules/files/files.module';
import { TypeOfDocument } from './entities/type-of-document.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Communication,TypeOfDocument]),
    FilesModule,
  ],
  controllers: [CommunicationsController],
  providers: [CommunicationsService],
  exports: [TypeOrmModule, CommunicationsService],
})
export class CommunicationsModule {}
