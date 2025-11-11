import { Controller, Get, Query } from '@nestjs/common';
import { AssistanceService } from 'src/modules/assistance/assistance.service';
import { PaginationDto } from 'src/modules/common';

@Controller('portal/tutorials')
export class PortalTutorialsController {
  constructor(private assistanceService: AssistanceService) {}

  @Get()
  findAll(@Query() queryParams: PaginationDto) {
    return this.assistanceService.findAll(queryParams);
  }
}
