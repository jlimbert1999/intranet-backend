import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';

import { GetPublicCommunicationsDto } from 'src/modules/communications/dtos/communication.dto';
import { CommunicationService } from 'src/modules/communications/communication.service';

@Controller('portal/communications')
export class PortalCommunicationsController {
  constructor(private coomunicationService: CommunicationService) {}

  @Get('types')
  getTypeCommunications() {
    return this.coomunicationService.getTypes();
  }

  @Get(':id')
  getOneCommunication(@Param('id', ParseUUIDPipe) id: string) {
    return this.coomunicationService.getOne(id);
  }

  @Get('latest')
  getLatest() {
    return this.coomunicationService.getLatest();
  }

  @Get()
  findAll(@Query() queryParams: GetPublicCommunicationsDto) {
    console.log("gettin data");
    return this.coomunicationService.findPublicPaginated(queryParams);
  }
}
