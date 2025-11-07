// Archivo: src/config/env.validation.ts (Modificado para PostgreSQL)

import { plainToInstance } from 'class-transformer';
import { IsNumber, IsString, validateSync, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';


export class EnvironmentVariables {
 
 // VARIABLES DE APLICACIÓN
 @Type(() => Number)
 @IsNumber()
 PORT: number;

 @IsString()
 HOST: string;

 // ❌ ELIMINADA la validación de DATABASE_URL (MongoDB)
 // @IsString()
 // DATABASE_URL: string;
 
 // ✅ AGREGADAS las propiedades individuales de POSTGRESQL
 
 @IsString()
 DATABASE_HOST: string;

 @Type(() => Number)
 @IsNumber()
 DATABASE_PORT: number;

 @IsString()
 DATABASE_NAME: string;

 @IsString()
 DATABASE_USER: string;
 
 @IsString()
 DATABASE_PASSWORD: string; 
 
    // Asegúrate de incluir aquí el resto de variables que usa tu app (JWT_KEY, MAIL_HOST, etc.)
    @IsString()
    JWT_KEY: string;
    // ... otras variables ...
}

export function validate(config: Record<string, unknown>) {
const validatedConfig = plainToInstance(EnvironmentVariables, config, {
enableImplicitConversion: true,
});
const errors = validateSync(validatedConfig, {
skipMissingProperties: false,
});

if (errors.length > 0) {
throw new Error(errors.toString());
}
return validatedConfig;
}