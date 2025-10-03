import { IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCommunicationDto {
    @IsString() @IsNotEmpty() @MaxLength(160)
    titulo: string;

    @IsString() @IsNotEmpty() @MaxLength(80)
    number_document: string;

    @IsDateString()
    publication_date: string; // YYYY-MM-DD

    @IsOptional()
    @IsString() @MaxLength(255)
    file?: string;
}
