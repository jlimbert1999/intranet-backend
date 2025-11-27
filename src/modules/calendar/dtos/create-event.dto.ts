import { IsString, IsBoolean, IsOptional, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;


  @IsDateString()
  @IsOptional()
  start: string;

  @IsDateString()
  @IsOptional()
  end?: string;

  @IsBoolean()
  @IsOptional()
  allDay?: boolean;

  @IsString()
  @IsOptional()
  rrule?: string; 
}