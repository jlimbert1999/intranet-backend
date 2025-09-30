import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Document, DocumentCategory, DocumentSection } from './entities';
import {
  DocumentCategoryService,
  DocumentSectionService,
  DocumentService,
} from './services';
import { DocumentController } from './controllers';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentSection, DocumentCategory, Document]),
  ],
  providers: [DocumentCategoryService, DocumentSectionService, DocumentService],
  controllers: [DocumentController],
})
export class DocumentModule {}
