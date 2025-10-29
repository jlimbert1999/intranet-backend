import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; 

import { Contact, ContactSchema } from './entities/contact.entity';
import { ContactsController } from './controllers/contact.controller'; 
import { ContactsService } from './services/contact.service'; 

import { InstanceType, InstanceTypeSchema } from './instance-types/entities/instance-type.entity';
import { InstanceTypesController } from './instance-types/controllers/instance-type.controller';
import { InstanceTypesService } from './instance-types/services/instance-type.service';


@Module({
 imports: [
 MongooseModule.forFeature([
   { name: Contact.name, schema: ContactSchema },
   { name: InstanceType.name, schema: InstanceTypeSchema }, 
  ]),
 ],
 controllers: [ContactsController, InstanceTypesController], 
 providers: [ContactsService, InstanceTypesService], 
 exports: [ContactsService], 
})
export class ContactsModule {}