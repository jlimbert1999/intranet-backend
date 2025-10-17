import { Body, Controller, Get, Ip, Param, Patch, Post } from '@nestjs/common';

import { DocumentCategoryService, DocumentService } from '../documents/services';
import { HeroSlidesService, QuickAccessService } from '../content/services';
import { FilterDocumentsDto } from '../documents/dtos';

@Controller('portal')
export class PortalController {
  constructor(
    private documentCategoryService: DocumentCategoryService,
    private quickAccessService: QuickAccessService,
    private documentService: DocumentService,
    private heroSlideService: HeroSlidesService,
  ) {}

  @Get('categories-sections')
  getCategoriesWithSections() {
    return this.documentCategoryService.getCategoriesWithSections();
  }

  @Post('documents')
  filterDocuments(@Body() body: FilterDocumentsDto) {
    return this.documentService.filterDocuments(body);
  }

  @Get('home')
  async getHomeData() {
    const [slides, quickAccess] = await Promise.all([
      this.heroSlideService.findAll(),
      this.quickAccessService.findAll(),
    ]);

    return {
      slides,
      quickAccess,
    };
  }

  @Patch('document/:id/increment-download')
  incrementDownload(@Param('id') id: string, @Ip() ip: string) {
    return this.documentService.incrementDownloadCount(id, ip);
  }
}
