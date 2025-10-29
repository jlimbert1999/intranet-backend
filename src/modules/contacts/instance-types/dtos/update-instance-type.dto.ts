import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateInstanceTypeDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;
}