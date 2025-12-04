import { PartialType } from '@nestjs/mapped-types';
import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  permissionIds: string[];
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
