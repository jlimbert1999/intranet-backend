import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { InstanceType } from '../entities/instance-type.entity';
import { CreateInstanceTypeDto } from '../dtos/create-instance-type.dto';
import { UpdateInstanceTypeDto } from '../dtos/update-instance-type.dto';

@Injectable()
export class InstanceTypesService {
  constructor(
    @InjectModel(InstanceType.name) private readonly instanceTypeModel: Model<InstanceType>,
  ) {}

  async create(dto: CreateInstanceTypeDto): Promise<InstanceType> {
    const newType = new this.instanceTypeModel(dto);
    return newType.save();
  }

  async findAll(): Promise<InstanceType[]> {
    return this.instanceTypeModel.find().sort({ name: 1 }).exec();
  }
  
  async findOne(id: string): Promise<InstanceType> {
    const type = await this.instanceTypeModel.findById(id).exec();
    if (!type) {
      throw new NotFoundException(`Tipo de institución con ID ${id} no encontrado.`);
    }
    return type;
  }

  async update(id: string, dto: UpdateInstanceTypeDto): Promise<InstanceType> {
    const updatedType = await this.instanceTypeModel
      .findByIdAndUpdate(id, dto, { new: true }) 
      .exec();
      
    if (!updatedType) {
      throw new NotFoundException(`Tipo de institución con ID ${id} no encontrado.`);
    }
    return updatedType;
  }

  async remove(id: string): Promise<any> {
    
    const result = await this.instanceTypeModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Tipo de institución con ID ${id} no encontrado.`);
    }
    return { deleted: true };
  }
}