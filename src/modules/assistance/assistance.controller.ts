import { Body, Controller, Get, Post } from '@nestjs/common';
import { AssistanceService } from './assistance.service';
import { CreateTutorialDto } from './dtos/tutorial.dto';

@Controller('assistance')
export class AssistanceController {
  constructor(private assistanceService: AssistanceService) {}
  @Post()
  create(@Body() body: CreateTutorialDto) {
    return this.assistanceService.create(body);
  }

  @Get()
  findAll() {
    return this.assistanceService.findAll();
  }
}
