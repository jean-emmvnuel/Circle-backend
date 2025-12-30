import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, MinLength } from "class-validator";

export class updateTeamDto {
    @IsNotEmpty({
        message: 'Le nom de l\'equipe est obligatoire'
    })
    @MinLength(3, {
        message: 'Le nom de l\'equipe doit contenir au moins 3 caracteres'
    })
    @IsOptional()
    @ApiProperty({
        example: 'Equipe 1',
        description: 'Nom de l\'equipe',
        required: false,
        minLength: 3,
        maxLength: 50,
    })  
    nom: string;

    @IsNotEmpty({
        message: 'Le pays de l\'equipe est obligatoire'
    })
    @MinLength(3, {
        message: 'Le pays de l\'equipe doit contenir au moins 3 caracteres'
    })
    @IsOptional()
    @ApiProperty({
        example: 'France',
        description: 'Pays de l\'equipe',
        required: false,
        minLength: 3,
        maxLength: 50,
    })
    pays: string;
}