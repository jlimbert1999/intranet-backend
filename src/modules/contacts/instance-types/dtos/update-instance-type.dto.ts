import { PartialType } from '@nestjs/mapped-types';
import { CreateInstanceTypeDto } from './create-instance-type.dto';

export class UpdateInstanceTypeDto extends PartialType(CreateInstanceTypeDto) {}
