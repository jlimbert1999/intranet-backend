import { Body, Controller, Get, Put } from '@nestjs/common';
import { QuickAccessService } from '../services';
import { CreateQuickAccessDto } from '../dtos';

@Controller('quick-access')
export class QuickAccessController {
  constructor(private quickAccesService: QuickAccessService) {}
  @Put()
  syncSlides(@Body() heroSlideDto: CreateQuickAccessDto) {
    return this.quickAccesService.syncItems(heroSlideDto);
  }

  @Get()
  findAll() {
    return this.quickAccesService.findAll();
  }
}
