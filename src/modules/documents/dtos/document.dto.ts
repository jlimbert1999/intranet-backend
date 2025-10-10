import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { PaginationDto } from 'src/modules/common';

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

  @IsInt()
  @Min(2000)
  @Max(new Date().getFullYear() + 1)
  @Type(() => Number)
  @IsOptional()
  fiscalYear?: number;
}

export class CreateDocumentsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentDto)
  documents: DocumentDto[];
}

type FilterField = 'originalName' | 'year';
type OrderDirection = 'ASC' | 'DESC';

export class FilterDocumentsDto extends PaginationDto {
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  categoryId?: number;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  sectionId?: number;

  @IsIn(['asc', 'desc'])
  @IsOptional()
  orderDirection: OrderDirection = 'DESC';

  @IsIn(['originalName', 'createdAt'])
  @IsOptional()
  orderBy?: FilterField;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  fiscalYear?: number;
}
