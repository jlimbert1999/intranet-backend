import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DocumentSection } from '../entities';

@Injectable()
export class DocumentSectionService {
  constructor(
    @InjectRepository(DocumentSection)
    private documentSectionRepository: Repository<DocumentSection>,
  ) {}

  async getSections() {
    return await this.documentSectionRepository.find();
  }
}
