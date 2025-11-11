import { Module } from '@nestjs/common';
import { PortalController } from './portal.controller';
import { DocumentModule } from '../documents/document.module';
import { ContentModule } from '../content/content.module';
import { CommunicationsModule } from '../communications/communications.module';
import { PortalCommunicationsController, PortalTutorialsController } from './controllers';
import { AssistanceModule } from '../assistance/assistance.module';

@Module({
  controllers: [PortalController, PortalCommunicationsController, PortalTutorialsController],
  imports: [DocumentModule, ContentModule, CommunicationsModule, AssistanceModule],
})
export class PortalModule {}
