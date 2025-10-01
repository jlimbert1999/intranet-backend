import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTypeOfDocumentDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(120)
    name: string;
}
