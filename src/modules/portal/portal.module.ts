import { Module } from '@nestjs/common';
import { PortalController } from './portal.controller';
import { DocumentModule } from '../documents/document.module';
import { ContentModule } from '../content/content.module';

@Module({
  controllers: [PortalController],
  imports: [DocumentModule, ContentModule],
})
export class PortalModule {}
