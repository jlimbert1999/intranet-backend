import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateInstanceTypeDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;
}
