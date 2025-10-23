import { BadGatewayException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCommunicationDto } from './dtos/communication.dto';
import { Communication, TypeCommunication } from './entities';
import { FilesService } from '../files/files.service';
import { FileGroup } from '../files/file-group.enum';

@Injectable()
export class CommunicationService {
  constructor(
    @InjectRepository(Communication) private communicationRepository: Repository<Communication>,
    @InjectRepository(TypeCommunication) private typeCommunicationRespository: Repository<TypeCommunication>,
    private fileService: FilesService,
  ) {}

  async getTypes() {
    return await this.typeCommunicationRespository.find();
  }

  async create(dto: CreateCommunicationDto) {
    try {
      const { typeId: typeCommunicationId, ...props } = dto;
      const typeCommunication = await this.typeCommunicationRespository.findOneBy({ id: typeCommunicationId });
      if (!typeCommunication) throw new BadGatewayException('Type communication not found');
      await this.checkDuplicateCode(props.code);
      const entity = this.communicationRepository.create({ ...props, type: typeCommunication });
      return this.communicationRepository.save(entity);
    } catch (error) {
      throw new InternalServerErrorException('Error creating communication');
    }
  }

  async listCommunications(opts?: { page?: number; limit?: number; search?: string; from?: string; to?: string }) {
    const page = Math.max(1, opts?.page ?? 1);
    const limit = Math.min(100, Math.max(1, opts?.limit ?? 10));

    const qb = this.communicationRepository.createQueryBuilder('c');

    if (opts?.search) {
      qb.andWhere('(c.titulo ILIKE :s OR c.number_document ILIKE :s)', { s: `%${opts.search}%` });
    }
    if (opts?.from) qb.andWhere('c.publication_date >= :from', { from: opts.from });
    if (opts?.to) qb.andWhere('c.publication_date <= :to', { to: opts.to });

    qb.orderBy('c.publication_date', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit, pages: Math.ceil(total / limit) };
  }

  // ----- Delete -----
  async deleteCommunication(id: number) {
    // const c = await this.getCommunication(id);
    // await this.commRepo.remove(c);
    // return { deleted: true };
  }

  async getLastCommunications(limit = 5) {
    const communications = await this.communicationRepository.find({ order: { publicationDate: 'DESC' }, take: limit });
    return communications.map((item) => this.plainCommunication(item));
  }

  async getOneCommunication(id: string) {
    const communication = await this.communicationRepository.findOne({ where: { id } });
    if (!communication) throw new NotFoundException(`Communication ${id} not found`);
    return this.plainCommunication(communication);
  }

  private async checkDuplicateCode(code: string) {
    const duplicate = await this.communicationRepository.findOneBy({ code: code });
    if (duplicate) throw new BadGatewayException(`Code: ${code} already exists}`);
  }

  private plainCommunication(communication: Communication) {
    const { fileName, previewName, ...rest } = communication;
    return {
      fileUrl: this.fileService.buildFileUrl(fileName, FileGroup.COMUNICATIONS),
      previewUrl: previewName ? this.fileService.buildFileUrl(previewName, FileGroup.COMUNICATIONS) : null,
      ...rest,
    };
  }
}
