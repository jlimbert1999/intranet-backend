import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Communication } from './entities/communication.entity';
import { TypeOfDocument } from './entities/type-of-document.entity';
import { CreateCommunicationDto } from './dto/create-communication.dto';
import { UpdateCommunicationDto } from './dto/update-communication.dto';
import { CreateTypeOfDocumentDto } from './dto/create-type-of-document.dto';

@Injectable()
export class CommunicationsService {
  constructor(
    @InjectRepository(Communication) private readonly  commRepo: Repository<Communication>,
    @InjectRepository(TypeOfDocument) private readonly  todRepo: Repository<TypeOfDocument>,
  ) {}

  // ----- TypeOfDocument -----
  async createType(dto: CreateTypeOfDocumentDto) {
    const entity = this.todRepo.create(dto);
    return this.todRepo.save(entity);
  }
  findAllTypes() { return this.todRepo.find({ order: { name: 'ASC' } }); }
  async getType(id: number) {
    const t = await this.todRepo.findOne({ where: { id } });
    if (!t) throw new NotFoundException('TypeOfDocument not found');
    return t;
  }

  // ----- Communications -----
  async createCommunication(dto: CreateCommunicationDto) {
    const tod = await this.todRepo.findOne({ where: { id: dto.typeOfDocumentId } });
    if (!tod) throw new NotFoundException('TypeOfDocument not found');
    const entity = this.commRepo.create({
      typeOfDocument: tod,
      area_id: dto.area_id,
      number_document: dto.number_document,
      publication_date: dto.publication_date,
    });
    return this.commRepo.save(entity);
  }

  async listCommunications(opts?: {
    page?: number; limit?: number; search?: string;
    typeOfDocumentId?: number; area_id?: number; from?: string; to?: string;
  }) {
    const page = Math.max(1, opts?.page ?? 1);
    const limit = Math.min(100, Math.max(1, opts?.limit ?? 10));

    const qb = this.commRepo.createQueryBuilder('c')
      .leftJoinAndSelect('c.typeOfDocument', 'tod');

    if (opts?.typeOfDocumentId) qb.andWhere('tod.id = :tid', { tid: opts.typeOfDocumentId });
    if (opts?.area_id) qb.andWhere('c.area_id = :aid', { aid: opts.area_id });
    if (opts?.search) qb.andWhere('c.number_document ILIKE :s', { s: `%${opts.search}%` });
    if (opts?.from) qb.andWhere('c.publication_date >= :from', { from: opts.from });
    if (opts?.to) qb.andWhere('c.publication_date <= :to', { to: opts.to });

    qb.orderBy('c.publication_date', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async getCommunication(id: number) {
    const c = await this.commRepo.findOne({ where: { id }, relations: { typeOfDocument: true } });
    if (!c) throw new NotFoundException('Communication not found');
    return c;
  }

  async updateCommunication(id: number, dto: UpdateCommunicationDto) {
    const c = await this.getCommunication(id);
    if (dto.typeOfDocumentId) {
      const tod = await this.todRepo.findOne({ where: { id: dto.typeOfDocumentId } });
      if (!tod) throw new NotFoundException('TypeOfDocument not found');
      c.typeOfDocument = tod;
    }
    if (dto.area_id !== undefined) c.area_id = dto.area_id;
    if (dto.number_document !== undefined) c.number_document = dto.number_document;
    if (dto.publication_date !== undefined) c.publication_date = dto.publication_date;
    return this.commRepo.save(c);
  }

  async deleteCommunication(id: number) {
    const c = await this.getCommunication(id);
    await this.commRepo.remove(c);
    return { deleted: true };
  }
}
