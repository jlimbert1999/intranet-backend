import { Body, Controller, Get, Post } from '@nestjs/common';
import { DocumentCategoryService, DocumentService } from '../documents/services';
import { FilterDocumentsDto } from '../documents/dtos';

@Controller('portal')
export class PortalController {
  constructor(
    private documentCategoryService: DocumentCategoryService,
    private documentService: DocumentService,
  ) {}

  @Get('categories-sections')
  getCategoriesWithSections() {
    return this.documentCategoryService.getCategoriesWithSections();
  }

  @Post('documents')
  filterDocuments(@Body() body: FilterDocumentsDto) {
    return this.documentService.filterDocuments(body);
  }
}
