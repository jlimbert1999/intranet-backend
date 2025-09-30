import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Document, DocumentCategory, DocumentSection } from '../entities';
import { CreateDocumentsDto, UpdateDocumentDto } from '../dtos';

@Injectable()
export class DocumentService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @InjectRepository(DocumentSection)
    private documentSectionRepository: Repository<DocumentSection>,
    @InjectRepository(DocumentCategory)
    private documentCategoryRepository: Repository<DocumentCategory>,
  ) {}

  async findAll() {
    return await this.documentCategoryRepository.find({
      relations: {
        documents: {
          section: true,
        },
      },
    });
  }

  async create(documentsDto: CreateDocumentsDto) {
    const { documents, sectionId, categoryId } = documentsDto;
    const { category, section } = await this.loadDocumentProps(
      categoryId,
      sectionId,
    );
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const models: Document[] = documents.map(({ fileName, originalName }) =>
        queryRunner.manager.create(Document, {
          originalName,
          fileName,
          section,
          category,
        }),
      );
      const result = await queryRunner.manager.save(models);
      await queryRunner.commitTransaction();

      return result;
    } catch (error: unknown) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(`Failed create documents`);
    } finally {
      await queryRunner.release();
    }
  }

  async update(currentCategoruId: number, documentsDto: UpdateDocumentDto) {
    const { documents = [] } = documentsDto;

    const currentDocuments = await this.documentRepository.find({
      where: { category: { id: currentCategoruId } },
    });

    const incomingIds = documents.filter(({ id }) => id).map(({ id }) => id);

    const toDelete = currentDocuments.filter(
      ({ id }) => !incomingIds.includes(id),
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (toDelete.length > 0) {
        await queryRunner.manager.remove(toDelete);
      }

      const toSave = documents.map((item) =>
        queryRunner.manager.create(Document, {
          id: item.id,
          fileName: item.fileName,
          originalName: item.originalName,
        }),
      );
      const result = await queryRunner.manager.save(toSave);
      await queryRunner.commitTransaction();
      return result;
    } catch (error: unknown) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(`Failed update documents`);
    } finally {
      await queryRunner.release();
    }
  }

  private async loadDocumentProps(categoryId: number, sectionId?: number) {
    const category = await this.documentCategoryRepository.manager.findOneBy(
      DocumentCategory,
      { id: categoryId },
    );
    if (!category) {
      throw new BadRequestException(`Category ${categoryId} not found`);
    }
    let section: DocumentSection | null = null;
    if (sectionId) {
      section = await this.documentSectionRepository.findOneBy({
        id: sectionId,
      });
    }
    return { category, section };
  }
}
