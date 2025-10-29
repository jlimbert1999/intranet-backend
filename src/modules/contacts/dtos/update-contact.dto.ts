import { IsMongoId, IsOptional, IsString, MaxLength, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateContactDto {
  
  @IsOptional()
  @IsMongoId({ message: 'instanceType debe ser un ID válido de Mongo' })
  instanceType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  instancia?: string;

  @IsOptional()
  @Type(() => Number) 
  @IsNumber()
  @Min(1)
  jefe?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  soporte?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  secretaria?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  telefonoFijo?: number;
}