import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { CacheModule } from '@nestjs/cache-manager';

import { EnvironmentVariables, validate } from './config/env.validation';
import { ContactsModule } from './modules/contacts/contacts.module';

import { CalendarModule } from './modules/calendar/calendar.module'; 

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

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        
        autoLoadEntities: true,
        
        synchronize: true, 
      }),
      inject: [ConfigService],
    }),

    ContactsModule,
    CalendarModule, 
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