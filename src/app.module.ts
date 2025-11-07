// Archivo: src/app.module.ts (Modificado para PostgreSQL)

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
// ❌ ELIMINAR: import { MongooseModule } from '@nestjs/mongoose'; 
// ✅ AGREGAR:
import { TypeOrmModule } from '@nestjs/typeorm'; 

import { EnvironmentVariables, validate } from './config/env.validation';
import { ContactsModule } from './modules/contacts/contacts.module'; 

// ... (Otros módulos que se importan)
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
 
 // 🛑 CONEXIÓN DE POSTGRESQL (TypeORM)
 TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
   // Configuración de PostgreSQL
   type: 'postgres',
   host: configService.get('DATABASE_HOST'),
   port: configService.get('DATABASE_PORT'),
   username: configService.get('DATABASE_USER'),
   password: configService.get('DATABASE_PASSWORD'),
   database: configService.get('DATABASE_NAME'),
   
   // Le dice a TypeORM dónde buscar las Entidades
   autoLoadEntities: true, 
   // Sincroniza el esquema (crea tablas si no existen). ¡Usar solo en desarrollo!
   synchronize: true, 
  }),
  inject: [ConfigService],
 }),
 // 🛑 FIN DE CONEXIÓN

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