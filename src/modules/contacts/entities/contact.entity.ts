import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { InstanceType } from '../instance-types/entities/instance-type.entity';

@Schema({ timestamps: true })
export class Contact extends Document {

  @Prop({ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'InstanceType', 
    required: true,
  })
  instanceType: InstanceType; 

  @Prop({ required: true, maxlength: 100 })
  instancia: string;

  @Prop({ type: Number, default: null })
  jefe: number | null;

  @Prop({ type: Number, default: null })
  soporte: number | null;

  @Prop({ type: Number, default: null })
  secretaria: number | null;

  @Prop({ type: Number, default: null })
  telefonoFijo: number | null;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);