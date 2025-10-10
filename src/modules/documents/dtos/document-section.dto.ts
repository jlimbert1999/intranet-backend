import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateDocumentSectionDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateDocumentSectionDto extends PartialType(CreateDocumentSectionDto) {}

export class CreateSectionWithCategoriesDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt({ each: true })
  categoriesIds: number[];
}

export class UpdateSectionWithCategoriesDto extends PartialType(CreateSectionWithCategoriesDto) {}
