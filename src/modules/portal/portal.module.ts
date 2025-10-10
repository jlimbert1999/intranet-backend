import { Module } from '@nestjs/common';
import { PortalController } from './portal.controller';
import { DocumentModule } from '../documents/document.module';

@Module({
  controllers: [PortalController],
  imports: [DocumentModule],
})
export class PortalModule {}
