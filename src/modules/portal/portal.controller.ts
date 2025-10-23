import { Body, Controller, Get, Ip, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';

import { DocumentCategoryService, DocumentService } from '../documents/services';
import { HeroSlidesService, QuickAccessService } from '../content/services';
import { CommunicationService } from '../communications/communication.service';
import { FilterDocumentsDto } from '../documents/dtos';

@Controller('portal')
export class PortalController {
  constructor(
    private documentCategoryService: DocumentCategoryService,
    private quickAccessService: QuickAccessService,
    private documentService: DocumentService,
    private heroSlideService: HeroSlidesService,
    private coomunicationService: CommunicationService,
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
    const [slides, quickAccess, communications] = await Promise.all([
      this.heroSlideService.findAll(),
      this.quickAccessService.findAll(),
      this.coomunicationService.getLastCommunications(10),
    ]);

    return {
      slides,
      quickAccess,
      communications,
    };
  }

  @Patch('document/:id/increment-download')
  incrementDownload(@Param('id') id: string, @Ip() ip: string) {
    return this.documentService.incrementDownloadCount(id, ip);
  }

  @Get('communications/:id')
  getOneCommunication(@Param('id', ParseUUIDPipe) id: string) {
    return this.coomunicationService.getOneCommunication(id);
  }
}
