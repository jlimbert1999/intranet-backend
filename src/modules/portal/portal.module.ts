import { Module } from '@nestjs/common';
import { PortalController } from './portal.controller';
import { DocumentModule } from '../documents/document.module';
import { ContentModule } from '../content/content.module';
import { CommunicationsModule } from '../communications/communications.module';

@Module({
  controllers: [PortalController],
  imports: [DocumentModule, ContentModule, CommunicationsModule],
})
export class PortalModule {}
