import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class DocumentDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  originalName: string;

  @IsString()
  @IsNotEmpty()
  fileName: string;
}

export class CreateDocumentsDto {
  @IsInt()
  categoryId: number;

  @IsInt()
  sectionId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentDto)
  @ArrayMinSize(1)
  documents: DocumentDto[];
}

export class UpdateDocumentDto extends PartialType(
  OmitType(CreateDocumentsDto, ['categoryId', 'sectionId']),
) {}
