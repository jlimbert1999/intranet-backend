import { Module } from '@nestjs/common';
import { CommunicationsService } from './communications.service';
import { CommunicationsController } from './communications.controller';
import { Communication } from './entities/communication.entity';
import { TypeOfDocument } from './entities/type-of-document.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Communication, TypeOfDocument]),
  ],
  controllers: [CommunicationsController],
  providers: [CommunicationsService],
  exports: [TypeOrmModule, CommunicationsService],
})
export class CommunicationsModule {}
