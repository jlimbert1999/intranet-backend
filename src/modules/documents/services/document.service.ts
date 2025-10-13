import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository, DataSource, FindOptionsWhere } from 'typeorm';

import { Document, DocumentCategory, DocumentSection, SectionCategory } from '../entities';
import { CreateDocumentsDto, FilterDocumentsDto } from '../dtos';
import { FilesService } from 'src/modules/files/files.service';
import { FileGroup } from 'src/modules/files/file-group.enum';
import { PaginationDto } from 'src/modules/common';

@Injectable()
export class DocumentService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Document) private docRepository: Repository<Document>,
    @InjectRepository(DocumentSection)
    private docSectionRepository: Repository<DocumentSection>,
    @InjectRepository(DocumentCategory)
    private docCategoryRepository: Repository<DocumentCategory>,
    @InjectRepository(SectionCategory)
    private sectionCategoryRep: Repository<SectionCategory>,
    private fileService: FilesService,
  ) {}

  async getDocumentsToManage({ term, limit, offset }: PaginationDto) {
    const [items, total] = await this.sectionCategoryRep.findAndCount({
      ...(term && {
        where: { documents: { originalName: ILike(`%${term}%`) } },
      }),
      // TODO filter by user id
      relations: { documents: true, section: true, category: true },
      order: { documents: { createdAt: 'DESC' } },
      take: limit,
      skip: offset,
    });
    return { items, total };
  }

  async syncDocuments(relationId: number, docsDto: CreateDocumentsDto) {
    const { documents } = docsDto;
    const sectionCategory = await this.sectionCategoryRep.findOne({
      where: { id: relationId },
      relations: { category: true, section: true, documents: true },
    });

    if (!sectionCategory) {
      throw new BadRequestException(`Relation ${relationId} not found`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingDocs = sectionCategory.documents;

      const newIds = documents.filter((d) => d.id).map((d) => d.id);

      const validIds = newIds.filter((id) => existingDocs.some((doc) => doc.id === id));

      const toDelete = existingDocs.filter((doc) => !validIds.includes(doc.id));
      if (toDelete.length) {
        await queryRunner.manager.remove(toDelete);
      }

      const toSave = documents.map((doc) =>
        queryRunner.manager.create(Document, {
          ...doc,
          sectionCategory,
        }),
      );

      const result = await queryRunner.manager.save(toSave);

      await queryRunner.commitTransaction();

      return { ...sectionCategory, documents: result };
    } catch (error: unknown) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(`Failed create documents`);
    } finally {
      await queryRunner.release();
    }
  }

  async filterDocuments(filter: FilterDocumentsDto) {
    console.log('FILTER BACKEND DOCUMENTS');
    const { limit, offset, term, categoryId, sectionId, fiscalYear, orderDirection } = filter;

    const where: FindOptionsWhere<Document> = {
      ...(term && { originalName: ILike(`%${term}%`) }),
      ...(categoryId && { sectionCategory: { category: { id: categoryId } } }),
      ...(sectionId && { sectionCategory: { section: { id: sectionId } } }),
      ...(fiscalYear && { fiscalYear }),
    };

    const [data, total] = await this.docRepository.findAndCount({
      where: where,
      ...(orderDirection && { order: { originalName: orderDirection } }),
      relations: {
        sectionCategory: {
          category: true,
          section: true,
        },
      },
      select: {
        sectionCategory: {
          category: {
            name: true,
          },
          section: {
            name: true,
          },
        },
      },
      take: limit,
      skip: offset,
    });

    return { documents: data.map((doc) => this.plainDocument(doc)), total };
  }

  private plainDocument(doc: Document) {
    const { fileName, ...properties } = doc;
    return {
      ...properties,
      fileName: this.fileService.buildFileUrl(fileName, FileGroup.DOCUMENTIS),
    };
  }
}
