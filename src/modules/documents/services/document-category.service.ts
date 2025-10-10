import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { CreateDocumentCategoryDto, UpdateDocumentCategoryDto } from '../dtos';
import { DocumentCategory } from '../entities';

@Injectable()
export class DocumentCategoryService {
  constructor(@InjectRepository(DocumentCategory) private categoryRepository: Repository<DocumentCategory>) {}

  async getCategoriesWithSections() {
    return await this.categoryRepository.find({
      relations: { sectionCategories: { section: true } },
    });
  }

  async create(data: CreateDocumentCategoryDto) {
    try {
      const model = this.categoryRepository.create(data);
      return await this.categoryRepository.save(model);
    } catch (error: unknown) {
      this.handleModifyException(error);
    }
  }

  async update(id: number, data: UpdateDocumentCategoryDto) {
    try {
      const { name } = data;

      const category = await this.categoryRepository.preload({ id, ...(name && { name }) });

      if (!category) throw new NotFoundException(`Category ${id} not found`);

      return await this.categoryRepository.save(category);
    } catch (error: unknown) {
      this.handleModifyException(error);
    }
  }

  async findAll() {
    return this.categoryRepository.find({ order: { id: 'DESC' } });
  }

  private handleModifyException(error: unknown): void {
    if (error instanceof QueryFailedError && error['code'] === '23505') {
      throw new BadRequestException(`Duplicate category name`);
    }
    throw new InternalServerErrorException(`Failed create cagory`);
  }
}
