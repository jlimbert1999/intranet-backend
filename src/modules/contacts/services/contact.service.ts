import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';

import { Contact } from '../entities/contact.entity';
import { CreateContactDto } from '../dtos/create-contact.dto';
import { UpdateContactDto } from '../dtos/update-contact.dto';
import { ContactFilterDto } from '../dtos/contact-filter.dto';
import { PaginatedResult } from '../interfaces/paginated-result.interface'; 

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contact.name) private readonly contactModel: Model<Contact>,
  ) {}

  async create(contactDto: CreateContactDto): Promise<Contact> {
    const newContact = new this.contactModel(contactDto);
    return newContact.save();
  }

  async findAll(filter: ContactFilterDto): Promise<PaginatedResult<Contact>> {
    const { page = 1, limit = 10, instanceType, search } = filter;
    const query: FilterQuery<Contact> = {};

    if (instanceType) {
      query.instanceType = instanceType;
    }

    if (search) {
      query.$or = [
       { instancia: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [contacts, total] = await Promise.all([
      this.contactModel
        .find(query)
        .populate('instanceType', 'name') 
        .skip(skip)
        .limit(limit)
        .exec(),
      this.contactModel.countDocuments(query).exec(),
    ]);

    return { data: contacts, total, page, limit };
  }

  async findOne(id: string): Promise<Contact> {
    const contact = await this.contactModel
      .findById(id)
      .populate('instanceType', 'name')
      .exec();
    if (!contact) {
      throw new NotFoundException(`Contacto con ID ${id} no encontrado.`);
    }
    return contact;
  }
  
  async update(id: string, updateDto: UpdateContactDto): Promise<Contact> {
    const updatedContact = await this.contactModel
      .findByIdAndUpdate(id, updateDto, { new: true }) 
      .exec();
      
    if (!updatedContact) {
      throw new NotFoundException(`Contacto con ID ${id} no encontrado.`);
    }
    return updatedContact;
  }

  async remove(id: string): Promise<any> {
    const result = await this.contactModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Contacto con ID ${id} no encontrado.`);
    }
    return { deleted: true };
  }
}