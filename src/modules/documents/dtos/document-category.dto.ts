import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateDocumentCategoryDto {
  @IsString()
  @MinLength(10)
  @MaxLength(100)
  @Transform(({ value }) => (value as string).trim().toUpperCase())
  name: string;
}

export class UpdateDocumentCategoryDto extends PartialType(
  CreateDocumentCategoryDto,
) {}
