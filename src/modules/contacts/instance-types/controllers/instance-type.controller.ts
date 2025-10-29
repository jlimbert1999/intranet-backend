import { Body, Controller, Get, Post, Delete, Param, Put } from '@nestjs/common';
import { InstanceTypesService } from '../services/instance-type.service'; 
import { CreateInstanceTypeDto } from '../dtos/create-instance-type.dto';
import { UpdateInstanceTypeDto } from '../dtos/update-instance-type.dto';

@Controller('contacts/instance-types')
export class InstanceTypesController {
 constructor(private readonly instanceTypesService: InstanceTypesService) {}

 @Post()
 create(@Body() dto: CreateInstanceTypeDto) {
  return this.instanceTypesService.create(dto);
 }

@Get()
 findAll() {
  return this.instanceTypesService.findAll();
 }
 
 @Get(':id')
 findOne(@Param('id') id: string) {
  return this.instanceTypesService.findOne(id);
 }

 @Put(':id')
 update(
 @Param('id') id: string,
  @Body() dto: UpdateInstanceTypeDto,
 ) {
  return this.instanceTypesService.update(id, dto);
 }

 @Delete(':id')
 remove(@Param('id') id: string) {
 return this.instanceTypesService.remove(id);
 }
}