import { IsDateString, IsInt, IsNotEmpty, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateCommunicationDto {
    @IsInt() @IsPositive()
    typeOfDocumentId: number;

    @IsInt() @IsPositive()
    area_id: number;

    @IsString() @IsNotEmpty() @MaxLength(80)
    number_document: string;

    @IsDateString()
    publication_date: string; // YYYY-MM-DD
}

