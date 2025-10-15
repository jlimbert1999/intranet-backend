import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, IsOptional, IsString, IsUrl, MaxLength, ValidateNested } from 'class-validator';

export class QuickAccessDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsUrl()
  url: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsInt()
  order?: number;
}
export class CreateQuickAccessDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => QuickAccessDto)
  items: QuickAccessDto[];
}
