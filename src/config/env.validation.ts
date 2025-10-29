import { plainToInstance } from 'class-transformer';
import { IsNumber, IsString, validateSync, IsOptional } from 'class-validator';
import { Type } from 'class-transformer'; // Necesario para IsNumber si no lo tienes


export class EnvironmentVariables {
  
  // VARIABLES DE APLICACIÓN
  @Type(() => Number) // Es necesario convertir el string del .env a número
  @IsNumber()
  PORT: number;

  @IsString()
  HOST: string;

  // ⬇️ SOLUCIÓN: Usamos la URL completa para MongoDB
  @IsString()
  DATABASE_URL: string;
  
  // ❌ LAS SIGUIENTES PROPIEDADES FUERON ELIMINADAS O COMENTADAS
  //    PORQUE YA NO SON USADAS POR MONGOOSE EN EL APP.MODULE.TS

  /*
  @IsString()
  DATABASE_HOST: string;

  @Type(() => Number)
  @IsNumber()
  DATABASE_PORT: number;

  @IsString()
  DATABASE_NAME: string;

  @IsString()
  DATABASE_USER: string;
  
  @IsString() // ⬅️ Tipo corregido
  DATABASE_PASSWORD: string; 
  */

  // ⚠️ Nota: Si tu proyecto base aún usa otras variables, déjalas,
  // pero asegúrate de que tengan un valor en .env o sean @IsOptional().
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