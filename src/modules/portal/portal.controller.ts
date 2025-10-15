import { Body, Controller, Get, Post } from '@nestjs/common';

import { DocumentCategoryService, DocumentService } from '../documents/services';
import { FilterDocumentsDto } from '../documents/dtos';
import { QuickAccessService } from '../content/services';

@Controller('portal')
export class PortalController {
  constructor(
    private documentCategoryService: DocumentCategoryService,
    private documentService: DocumentService,
    private quickAccessService: QuickAccessService,
  ) {}

  @Get('categories-sections')
  getCategoriesWithSections() {
    return this.documentCategoryService.getCategoriesWithSections();
  }

  @Get('quick-access')
  getQuickAccess() {
    return this.quickAccessService.findAll();
  }

  @Post('documents')
  filterDocuments(@Body() body: FilterDocumentsDto) {
    return this.documentService.filterDocuments(body);
  }
}
