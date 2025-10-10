import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { DocumentCategoryService, DocumentSectionService } from '../services';
import { CreateSectionWithCategoriesDto } from '../dtos';
import { PaginationDto } from 'src/modules/common';

@Controller('document-sections')
export class DocumentSectionController {
  constructor(
    private sectionService: DocumentSectionService,
    private categoryService: DocumentCategoryService,
  ) {}

  @Get('categories')
  getCategories() {
    return this.categoryService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: CreateSectionWithCategoriesDto) {
    return this.sectionService.update(+id, body);
  }

  @Post()
  create(@Body() body: CreateSectionWithCategoriesDto) {
    return this.sectionService.create(body);
  }

  @Get()
  findAllGrouped(@Query() queryParams: PaginationDto) {
    return this.sectionService.findSectionsWithCategories(queryParams);
  }
}
