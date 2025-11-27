import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalendarEvent } from '../entities/calendar-event.entity';
import { CreateEventDto } from '../dtos/create-event.dto';

@Injectable()
export class CalendarService {
 constructor(
  @InjectRepository(CalendarEvent)
  private readonly eventRepository: Repository<CalendarEvent>,
 ) {}

 async create(createEventDto: CreateEventDto) {
  const event = this.eventRepository.create(createEventDto);
  return await this.eventRepository.save(event);
 }


async findAll(startStr?: string, endStr?: string) {

 if (!startStr || !endStr) {
  return await this.eventRepository.find({
   order: {
    createdAt: 'DESC', 
   },
  });
 }

 const query = this.eventRepository.createQueryBuilder('event');

 const startDate = new Date(startStr);
 const endDate = new Date(endStr);

 query.where(
  '(event.start >= :startDate AND event.start < :endDate) OR (event.rrule IS NOT NULL)',
  { startDate, endDate }
 );
  
 query.orderBy('event.createdAt', 'DESC'); 

 return await query.getMany();
}


 async update(id: string, updateEventDto: any) {
  const event = await this.eventRepository.preload({
   id: id,
   ...updateEventDto,
  });
  if (!event) throw new NotFoundException(`Evento #${id} no encontrado`);
  return await this.eventRepository.save(event);
 }

 async remove(id: string) {
  const event = await this.eventRepository.findOneBy({ id });
  if (!event) throw new NotFoundException(`Evento #${id} no encontrado`);
  return await this.eventRepository.remove(event);
 }
}