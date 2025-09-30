import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import {
  DocumentCategoryService,
  DocumentSectionService,
  DocumentService,
} from '../services';
import { CreateDocumentsDto, UpdateDocumentDto } from '../dtos';

@Controller('document')
export class DocumentController {
  constructor(
    private documentCategoryService: DocumentCategoryService,
    private documentSectionService: DocumentSectionService,
    private documentService: DocumentService,
  ) {}

  @Get('categories')
  getCategories() {
    return this.documentCategoryService.getCategories();
  }

  @Get('sections')
  getSections() {
    return this.documentSectionService.getSections();
  }

  @Get()
  findAll() {
    return this.documentService.findAll();
  }

  @Post()
  createDocuments(@Body() body: CreateDocumentsDto) {
    return this.documentService.create(body);
  }

  @Put(':categoryId')
  update(
    @Param('categoryId') categoryId: string,
    @Body() body: UpdateDocumentDto,
  ) {
    return this.documentService.update(+categoryId, body);
  }
}
