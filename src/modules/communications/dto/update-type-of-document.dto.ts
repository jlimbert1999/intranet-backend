import { PartialType } from '@nestjs/mapped-types';
import { CreateTypeOfDocumentDto } from './create-type-of-document.dto';

export class UpdateTypeOfDocumentDto extends PartialType(CreateTypeOfDocumentDto) {}
