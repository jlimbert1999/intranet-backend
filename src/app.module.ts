import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose'; 

import { EnvironmentVariables, validate } from './config/env.validation';
import { ContactsModule } from './modules/contacts/contacts.module'; 

// import { DocumentModule } from './modules/documents/document.module';
// import { ContentModule } from './modules/content/content.module';
// import { PortalModule } from './modules/portal/portal.module';
// import { FilesModule } from './modules/files/files.module';
// import { CommunicationsModule } from './modules/communications/communications.module';

import { CacheModule } from '@nestjs/cache-manager';


@Module({
imports: [
   ConfigModule.forRoot({
     validate,
     isGlobal: true,
   }),
   CacheModule.register({
     ttl: 0,
     isGlobal: true,
   }),
   
   MongooseModule.forRootAsync({
     imports: [ConfigModule],
     useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
       uri: configService.get('DATABASE_URL'), 
     }),
     inject: [ConfigService],
   }),

  ContactsModule, 
   // FilesModule,
   // ContentModule,
   // DocumentModule,
   // PortalModule,
   // CommunicationsModule,
 ],
 controllers: [],
 providers: [],
})
export class AppModule {}