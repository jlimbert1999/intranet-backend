import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Document, DocumentCategory, DocumentSection, SectionCategory } from './entities';
import { DocumentCategoryService, DocumentSectionService, DocumentService } from './services';
import { DocumentCategoryController, DocumentController, DocumentSectionController } from './controllers';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentSection, DocumentCategory, SectionCategory, Document]), FilesModule],
  providers: [DocumentCategoryService, DocumentSectionService, DocumentService],
  controllers: [DocumentController, DocumentSectionController, DocumentCategoryController],
  exports: [DocumentService, DocumentCategoryService],
})
export class DocumentModule {}
