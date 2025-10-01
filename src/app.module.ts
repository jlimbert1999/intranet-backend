import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EnvironmentVariables, validate } from './config/env.validation';
import { ContentModule } from './modules/content/content.module';
import { FilesModule } from './modules/files/files.module';
import { DocumentModule } from './modules/documents/document.module';
import { CommunicationsModule } from './modules/communications/communications.module';
import { CommunicationsController } from './modules/communications/communications.controller';
import { CommunicationsService } from './modules/communications/communications.service';


@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: +configService.get('DATABASE_PORT'),
        database: configService.get('DATABASE_NAME'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    FilesModule,
    ContentModule,
    DocumentModule,
    CommunicationsModule,
  ],
  controllers: [CommunicationsController],
  providers: [CommunicationsService, CommunicationsService],
})
export class AppModule {}
