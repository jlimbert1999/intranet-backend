import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Communication, TypeCommunication } from './entities';
import { CommunicationService } from './communication.service';
import { CommunicationController } from './communication.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Communication, TypeCommunication])],
  providers: [CommunicationService],
  controllers: [CommunicationController],
})
export class CommunicationsModule {}
