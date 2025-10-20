import { BadGatewayException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCommunicationDto } from './dtos/communication.dto';
import { Communication, TypeCommunication } from './entities';

@Injectable()
export class CommunicationService {
  constructor(
    @InjectRepository(Communication) private communicationRepository: Repository<Communication>,
    @InjectRepository(TypeCommunication) private typeCommunicationRespository: Repository<TypeCommunication>,
  ) {}

  async getTypes() {
    return await this.typeCommunicationRespository.find();
  }

  async create(dto: CreateCommunicationDto) {
    try {
      const { typeCommunicationId, ...props } = dto;
      const typeCommunication = await this.typeCommunicationRespository.findOneBy({ id: typeCommunicationId });
      if (!typeCommunication) throw new BadGatewayException('Type communication not found');
      await this.checkDuplicateCode(props.code);
      const entity = this.communicationRepository.create({ ...props, typeCommunication });
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
    return await this.communicationRepository.find({ order: { publication_date: 'DESC' }, take: limit });
  }

  private async checkDuplicateCode(code: string) {
    const duplicate = await this.communicationRepository.findOneBy({ code: code });
    if (duplicate) throw new BadGatewayException(`Code: ${code} already exists}`);
  }
}
