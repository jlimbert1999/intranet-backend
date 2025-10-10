import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateDocumentCategoryDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Transform(({ value }) => (value as string).trim().toUpperCase())
  name: string;
}

export class UpdateDocumentCategoryDto extends PartialType(CreateDocumentCategoryDto) {}
