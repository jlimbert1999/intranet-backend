import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, ParseFilePipeBuilder, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CommunicationsService } from './communications.service';
import { CreateCommunicationDto } from './dto/create-communication.dto';
import { UpdateCommunicationDto } from './dto/update-communication.dto';
// 👇 validadores y constantes del módulo de files
import { CustomFileTypeValidator } from 'src/modules/files/validators/custom-file-type.validator';
import { ALLOWED_FILE_TYPES } from 'src/modules/files/constants';

import { FileInterceptor } from '@nestjs/platform-express';

@Controller('communications')
export class CommunicationsController {
  constructor(private service: CommunicationsService) {}

  @Post()
  createComm(@Body() dto: CreateCommunicationDto) {
    return this.service.createCommunication(dto);
  }

  @Get()
  listComms(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.service.listCommunications({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search, from, to,
    });
  }

  @Get(':id')
  getComm(@Param('id', ParseIntPipe) id: number) {
    return this.service.getCommunication(id);
  }

  @Patch(':id')
  updComm(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCommunicationDto) {
    return this.service.updateCommunication(id, dto);
  }

  @Delete(':id')
  delComm(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteCommunication(id);
  }

   // ---------- NUEVO: subir y adjuntar archivo a una communication ----------
  @Post(':id/file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCommunicationFile(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addValidator(
          new CustomFileTypeValidator({
            validTypes: ALLOWED_FILE_TYPES.DOCUMENTS, // pdf, docx, xls, imágenes, etc.
          }),
        )
        .addMaxSizeValidator({ maxSize: 5 * 1024 * 1024 }) // 5MB
        .build(),
    )
    file: Express.Multer.File,
  ) {
    return this.service.attachFileToCommunication(id, file);
  }
}
