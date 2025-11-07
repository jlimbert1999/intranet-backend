import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Not } from 'typeorm';
import { InstanceType } from '../entities/instance-type.entity';
import { CreateInstanceTypeDto } from '../dtos/create-instance-type.dto';
import { UpdateInstanceTypeDto } from '../dtos/update-instance-type.dto';

@Injectable()
export class InstanceTypesService {
  constructor(
    @InjectRepository(InstanceType)
    private readonly repo: Repository<InstanceType>,
  ) {}

  private normalizeName(name: string) {
    return name.trim();
  }

  async create(dto: CreateInstanceTypeDto) {
    const name = this.normalizeName(dto.name);

    const exists = await this.repo.findOne({
      where: { name: ILike(name) },
    });

    if (exists) {
      throw new BadRequestException(`El tipo de entidad "${dto.name}" ya existe.`);
    }

    const newEntity = this.repo.create({ name });
    return this.repo.save(newEntity);
  }

  async update(id: string, dto: UpdateInstanceTypeDto) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Tipo de entidad con id "${id}" no encontrado.`);

    if (dto.name) {
      const name = this.normalizeName(dto.name);

      const exists = await this.repo.findOne({
        where: { name: ILike(name), id: Not(id) },
      });

      if (exists) {
        throw new BadRequestException(`El tipo de entidad "${dto.name}" ya existe.`);
      }

      entity.name = name;
    }

    await this.repo.save(entity);
    return entity;
  }

  async findAll() {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Tipo de entidad con id "${id}" no encontrado.`);
    return entity;
  }

  async remove(id: string) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Tipo de entidad con id "${id}" no encontrado.`);
    return this.repo.remove(entity);
  }
}
