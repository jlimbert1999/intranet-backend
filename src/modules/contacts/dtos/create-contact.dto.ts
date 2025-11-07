import { IsOptional, IsString, IsUUID, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateContactDto {
  @IsOptional()
  @IsUUID()
  instanceTypeId?: string;

  @IsString()
  instancia: string;

  @IsOptional()
  @IsString()
  direccion?: string;

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
