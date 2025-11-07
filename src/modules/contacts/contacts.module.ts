import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 

import { Contact } from './entities/contact.entity';
import { ContactsController } from './controllers/contact.controller'; 
import { ContactsService } from './services/contact.service'; 

import { InstanceType } from './instance-types/entities/instance-type.entity'; 
import { InstanceTypesController } from './instance-types/controllers/instance-type.controller';
import { InstanceTypesService } from './instance-types/services/instance-type.service';


@Module({
imports: [
 TypeOrmModule.forFeature([ 
  Contact, 
  InstanceType,
 ]),
],
controllers: [ContactsController, InstanceTypesController], 
providers: [ContactsService, InstanceTypesService], 
exports: [ContactsService], 
})
export class ContactsModule {}