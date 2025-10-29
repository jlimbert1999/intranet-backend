import { IsMongoId, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ContactFilterDto {
  
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsMongoId({ message: 'El filtro instanceType debe ser un ID válido de Mongo' })
  instanceType?: string;

  @IsOptional()
  @IsString()
  search?: string;
}