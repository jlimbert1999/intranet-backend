import { Body, Controller, Get, Post, Delete, Param, Put, Query } from '@nestjs/common';
import { ContactsService } from '../services/contact.service';
import { CreateContactDto } from '../dtos/create-contact.dto';
import { UpdateContactDto } from '../dtos/update-contact.dto';
import { ContactFilterDto } from '../dtos/contact-filter.dto';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  create(@Body() contactDto: CreateContactDto) {
    return this.contactsService.create(contactDto);
  }

  @Get('list')
  findAll() {
    return this.contactsService.findAll();
  }

  @Get('portal-list')
  findAllPortal(@Query() filterDto: ContactFilterDto) {
    return this.contactsService.findAllPaginated(filterDto);
  }
  
  @Get('id/:id')
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(id);
  }

  @Put('id/:id')
  update(@Param('id') id: string, @Body() updateDto: UpdateContactDto) {
    return this.contactsService.update(id, updateDto);
  }

  @Delete('id/:id')
  remove(@Param('id') id: string) {
    return this.contactsService.remove(id);
  }
}