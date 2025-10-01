import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { CommunicationsService } from './communications.service';
import { CreateTypeOfDocumentDto } from './dto/create-type-of-document.dto';
import { CreateCommunicationDto } from './dto/create-communication.dto';
import { UpdateCommunicationDto } from './dto/update-communication.dto';

@Controller()
export class CommunicationsController {
  constructor(private service: CommunicationsService) {}

  // ---- TypeOfDocuments ----
  @Post('type-of-documents')
  createType(@Body() dto: CreateTypeOfDocumentDto) {
    return this.service.createType(dto);
  }

  @Get('type-of-documents')
  listTypes() {
    return this.service.findAllTypes();
  }

  @Get('type-of-documents/:id')
  getType(@Param('id', ParseIntPipe) id: number) {
    return this.service.getType(id);
  }

  // ---- Communications ----
  @Post('communications')
  createComm(@Body() dto: CreateCommunicationDto) {
    return this.service.createCommunication(dto);
  }

  @Get('communications')
  listComms(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('typeOfDocumentId') typeOfDocumentId?: string,
    @Query('area_id') area_id?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.service.listCommunications({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search,
      typeOfDocumentId: typeOfDocumentId ? Number(typeOfDocumentId) : undefined,
      area_id: area_id ? Number(area_id) : undefined,
      from, to,
    });
    }

  @Get('communications/:id')
  getComm(@Param('id', ParseIntPipe) id: number) {
    return this.service.getCommunication(id);
  }

  @Patch('communications/:id')
  updComm(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCommunicationDto) {
    return this.service.updateCommunication(id, dto);
  }

  @Delete('communications/:id')
  delComm(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteCommunication(id);
  }
}
