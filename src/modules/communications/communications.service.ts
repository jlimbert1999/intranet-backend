import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Communication } from './entities/communication.entity';
import { CreateCommunicationDto } from './dto/create-communication.dto';
import { UpdateCommunicationDto } from './dto/update-communication.dto';
import { FilesService } from 'src/modules/files/files.service';
import { FileGroup } from 'src/modules/files/file-group.enum';

@Injectable()
export class CommunicationsService {
  constructor(
    @InjectRepository(Communication)
    private readonly commRepo: Repository<Communication>,
    // 👇 inyecta FilesService
    private readonly filesService: FilesService,
  ) {}

  // ----- Create -----
  async createCommunication(dto: CreateCommunicationDto) {
    const entity = this.commRepo.create({
      titulo: dto.titulo,
      number_document: dto.number_document,
      publication_date: dto.publication_date,
      file: dto.file ?? null,
    });
    return this.commRepo.save(entity);
  }

  
  async listCommunications(opts?: {
    page?: number; limit?: number; search?: string; from?: string; to?: string;
  }) {
    const page = Math.max(1, opts?.page ?? 1);
    const limit = Math.min(100, Math.max(1, opts?.limit ?? 10));

    const qb = this.commRepo.createQueryBuilder('c');

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

  // ----- Get by id -----
  async getCommunication(id: number) {
    const c = await this.commRepo.findOne({ where: { id } });
    if (!c) throw new NotFoundException('Communication not found');
    return c;
  }

  // ----- Update -----
  async updateCommunication(id: number, dto: UpdateCommunicationDto) {
    const c = await this.getCommunication(id);
    if (dto.titulo !== undefined) c.titulo = dto.titulo;
    if (dto.number_document !== undefined) c.number_document = dto.number_document;
    if (dto.publication_date !== undefined) c.publication_date = dto.publication_date;
    if (dto.file !== undefined) c.file = dto.file ?? null;
    return this.commRepo.save(c);
  }

  // ----- Delete -----
  async deleteCommunication(id: number) {
    const c = await this.getCommunication(id);
    await this.commRepo.remove(c);
    return { deleted: true };
  }
//-----------------------------------------------------------------------------

  async attachFileToCommunication(id: number, file: Express.Multer.File) {
    const c = await this.getCommunication(id);

    
    const saved = await this.filesService.saveFile(file, FileGroup.DOCUMENTIS);

    const publicUrl = this.filesService.buildFileUrl(saved.fileName, FileGroup.DOCUMENTIS);

    c.file = publicUrl;
    await this.commRepo.save(c);

    return {
      message: 'File attached successfully',
      file: {
        url: publicUrl,
        fileName: saved.fileName,
        originalName: saved.originalName,
        type: saved.type, // 'image' | 'video' | 'audio' | 'document'
      },
      communication: c,
    };
  }

}
