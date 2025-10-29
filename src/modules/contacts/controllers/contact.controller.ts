import { Body, Controller, Get, Post, Delete, Query, Param, Put } from '@nestjs/common';
import { ContactsService } from '../services/contact.service';
import { CreateContactDto } from '../dtos/create-contact.dto';
import { ContactFilterDto } from '../dtos/contact-filter.dto';
import { UpdateContactDto } from '../dtos/update-contact.dto';
import { PaginatedResult } from '../interfaces/paginated-result.interface'; 


@Controller('contacts')
export class ContactsController {
 constructor(private readonly contactsService: ContactsService) {}

 @Post()
 create(@Body() contactDto: CreateContactDto) {
  return this.contactsService.create(contactDto);
 }

 @Get('list')
 findAll(@Query() filterDto: ContactFilterDto) {
  return this.contactsService.findAll(filterDto);
 }

 @Get('id/:id')
 findOne(@Param('id') id: string) {
  return this.contactsService.findOne(id);
 }
  @Put('id/:id') 
 update(
 @Param('id') id: string, 
  @Body() updateDto: UpdateContactDto
) {
  return this.contactsService.update(id, updateDto);
 }
 @Delete('id/:id') 
 remove(@Param('id') id: string) {
  return this.contactsService.remove(id);
 }
}