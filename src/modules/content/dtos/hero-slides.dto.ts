import { Type } from 'class-transformer';
import { ValidateNested, ArrayMinSize, IsNotEmpty, IsArray, IsString, IsNumber, IsOptional } from 'class-validator';

export class HeroSlideDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsNumber()
  order: number;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  redirectUrl: string;
}

export class CreateHeroSlideDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => HeroSlideDto)
  slides: HeroSlideDto[];
}
