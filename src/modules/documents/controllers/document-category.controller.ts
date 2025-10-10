import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { DocumentCategoryService } from '../services';
import { CreateDocumentCategoryDto, UpdateDocumentCategoryDto } from '../dtos';

@Controller('document-category')
export class DocumentCategoryController {
  constructor(private categoryService: DocumentCategoryService) {}

  @Get('categories')
  getCategories() {
    return this.categoryService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateDocumentCategoryDto) {
    return this.categoryService.update(+id, body);
  }

  @Post()
  create(@Body() body: CreateDocumentCategoryDto) {
    return this.categoryService.create(body);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }
}
