import { Controller, Post, Body, Get, Query, Delete, Param, Patch } from '@nestjs/common';
import { CalendarService } from '../services/calendar.service';
import { CreateEventDto } from '../dtos/create-event.dto'; 
import { CalendarEvent } from '../entities/calendar-event.entity'; 

@Controller('calendar') 
export class CalendarController {
 constructor(private readonly calendarService: CalendarService) {}

 @Post()
 async create(@Body() createEventDto: CreateEventDto): Promise<CalendarEvent> {
  return this.calendarService.create(createEventDto); 
 }

 @Patch(':id')
 async update(@Param('id') id: string, @Body() updateEventDto: CreateEventDto): Promise<CalendarEvent> {
  return this.calendarService.update(id, updateEventDto);
 }

 @Get()
 async findAll(
  @Query('start') startStr: string, 
  @Query('end') endStr: string
   ): Promise<CalendarEvent[]> {
  return this.calendarService.findAll(startStr, endStr); 
 }

 @Delete(':id')
 async remove(@Param('id') id: string): Promise<void> {
  await this.calendarService.remove(id);
  return;
 }
}