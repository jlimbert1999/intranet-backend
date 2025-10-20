import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommunicationService } from './communication.service';
import { CreateCommunicationDto } from './dtos/communication.dto';

@Controller('communications')
export class CommunicationController {
  constructor(private communicationService: CommunicationService) {}

  @Get('types')
  getTYpes() {
    return this.communicationService.getTypes();
  }

  @Post()
  create(@Body() body: CreateCommunicationDto) {
    return this.communicationService.create(body);
  }
}
