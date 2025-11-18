import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm'; // 👈 Usa ILike en lugar de Like

import { Contact } from '../entities/contact.entity';
import { InstanceType } from '../instance-types/entities/instance-type.entity';
import { CreateContactDto } from '../dtos/create-contact.dto';
import { UpdateContactDto } from '../dtos/update-contact.dto';
import { ContactFilterDto } from '../dtos/contact-filter.dto';
import { PaginatedResult } from '../interfaces/paginated-result.interface';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,

    @InjectRepository(InstanceType)
    private readonly instanceTypeRepository: Repository<InstanceType>,
  ) {}

  async create(contactDto: CreateContactDto): Promise<Contact> {
    const {
      instanceTypeId,
      instancia,
      direccion,
      jefe,
      soporte,
      secretaria,
      telefonoFijo,
    } = contactDto;

    const instanceType: InstanceType | null = instanceTypeId
      ? await this.instanceTypeRepository.findOne({ where: { id: instanceTypeId } })
      : null;

    if (instanceTypeId && !instanceType) {
      throw new NotFoundException(`Tipo de instancia con ID ${instanceTypeId} no encontrado.`);
    }

    const newContact = this.contactRepository.create({
      instancia,
      direccion: direccion ?? null,
      jefe: jefe ?? null,
      soporte: soporte ?? null,
      secretaria: secretaria ?? null,
      telefonoFijo: telefonoFijo ?? null,
      instanceType: instanceType,
      instanceTypeId: instanceTypeId ?? null,
    });

    return this.contactRepository.save(newContact);
  }

  async findAll(): Promise<Contact[]> {
    return this.contactRepository.find({
      relations: ['instanceType'],
      order: { instancia: 'ASC' },
    });
  }

  /**
   * 🔍 Obtiene lista de contactos paginada y filtrada (por texto y/o institución)
   */
  async findAllPaginated(
    filter: ContactFilterDto,
  ): Promise<PaginatedResult<Contact>> {
    const { page = 1, limit = 10, search = '', instanceType } = filter;
    const offset = (page - 1) * limit;

    const searchPattern = `%${search}%`;

    // 🧠 Filtros dinámicos
    const whereCondition: any[] = [];

    if (search) {
      whereCondition.push(
        { instancia: ILike(searchPattern) },
        { instanceType: { name: ILike(searchPattern) } },
      );
    }

    if (instanceType) {
      whereCondition.push({
        instanceType: { id: instanceType },
      });
    }

    const [data, total] = await this.contactRepository.findAndCount({
      where: whereCondition.length > 0 ? whereCondition : {},
      relations: ['instanceType'],
      order: { instancia: 'ASC' },
      skip: offset,
      take: limit,
    });

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Contact> {
    const contact = await this.contactRepository.findOne({
      where: { id },
      relations: ['instanceType'],
    });

    if (!contact) throw new NotFoundException(`Contacto con ID ${id} no encontrado.`);
    return contact;
  }

  async update(id: string, updateDto: UpdateContactDto): Promise<Contact> {
    const contact = await this.findOne(id);

    const { instanceTypeId, instancia, direccion, jefe, soporte, secretaria, telefonoFijo } =
      updateDto;

    if (instanceTypeId !== undefined) {
      if (instanceTypeId === null) {
        contact.instanceType = null;
        contact.instanceTypeId = null;
      } else {
        const instanceType: InstanceType | null = await this.instanceTypeRepository.findOne({
          where: { id: instanceTypeId },
        });
        if (!instanceType) {
          throw new NotFoundException(`Tipo de instancia con ID ${instanceTypeId} no encontrado.`);
        }
        contact.instanceType = instanceType;
        contact.instanceTypeId = instanceTypeId;
      }
    }

    if (instancia !== undefined) contact.instancia = instancia;
    if (direccion !== undefined) contact.direccion = direccion ?? null;
    if (jefe !== undefined) contact.jefe = jefe ?? null;
    if (soporte !== undefined) contact.soporte = soporte ?? null;
    if (secretaria !== undefined) contact.secretaria = secretaria ?? null;
    if (telefonoFijo !== undefined) contact.telefonoFijo = telefonoFijo ?? null;

    return this.contactRepository.save(contact);
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.contactRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Contacto con ID ${id} no encontrado.`);
    return { deleted: true };
  }
}
