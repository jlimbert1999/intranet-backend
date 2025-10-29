import { IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateContactDto {
  
  @IsMongoId({ message: 'instanceType debe ser un ID válido de Mongo' })
  @IsNotEmpty()
  instanceType: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  instancia: string;

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