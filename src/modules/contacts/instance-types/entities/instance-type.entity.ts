import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class InstanceType extends Document {
  
  @Prop({ required: true, unique: true, maxlength: 50 })
  name: string;
}

export const InstanceTypeSchema = SchemaFactory.createForClass(InstanceType);