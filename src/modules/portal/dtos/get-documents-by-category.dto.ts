import { Type } from 'class-transformer';
import { IsDate, IsIn, IsInt, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/modules/common';

type FilterField = 'originalName' | 'createdAt';
type OrderDirection = 'asc' | 'desc';

export class FilterDocsByCategoryDto extends PaginationDto {
  @IsIn(['originalName', 'createdAt'])
  @IsOptional()
  orderBy?: FilterField;

  @IsIn(['asc', 'desc'])
  @IsOptional()
  orderDirection?: OrderDirection = 'desc';

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  createdAt?: Date;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  sectionId?: number;

}
