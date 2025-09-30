import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DocumentCategory } from '../entities';

@Injectable()
export class DocumentCategoryService {
  constructor(
    @InjectRepository(DocumentCategory)
    private documentCategoryRepository: Repository<DocumentCategory>,
  ) {}

  async getCategories() {
    return await this.documentCategoryRepository.find();
  }
}
