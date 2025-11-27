import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('calendar_events')
export class CalendarEvent {
@PrimaryGeneratedColumn('uuid')
id: string;

@Column() 
title: string;
@Column({ nullable: true }) 
description: string; 

@Column({ type: 'timestamp with time zone', nullable: true })
start: Date;

@Column({ type: 'timestamp with time zone', nullable: true })
end: Date | null;

@Column({ default: false })
allDay: boolean;

@Column({ type: 'varchar', nullable: true }) 
rrule: string | null;

@CreateDateColumn({ type: 'timestamp with time zone', nullable: true })
createdAt: Date; 
}