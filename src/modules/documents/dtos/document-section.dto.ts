import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDocumentSectionDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateDocumentSectionDto extends PartialType(
  CreateDocumentSectionDto,
) {}
