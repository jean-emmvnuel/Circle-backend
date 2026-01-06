import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";


export class registerDto {
    @ApiProperty({
        example: 'mvnou_official',
        description: 'nom de l\'utilisateur',
        required: true,
        minLength: 3,
        maxLength: 50,
    })
    @IsString({ message: 'Le nom de l\'utilisateur doit etre une chaine de caracteres' })
    @IsNotEmpty({ message: 'Le nom de l\'utilisateur est obligatoire' })
    username: string;



    @ApiProperty({
        example: 'john.doe@example.com',
        description: 'Email de l\'utilisateur',
        required: true,
    })
    @IsString({ message: 'L\'email doit etre une chaine de caracteres' })
    @IsNotEmpty({ message: 'L\'email est obligatoire' })
    @IsEmail({
        blacklisted_chars: "/,?{}[]#$%^&*()",
    }, { message: 'L\'email doit etre un email valide' })
    email: string;

    
    @ApiProperty({
        example: 'password123',
        description: 'Mot de passe de l\'utilisateur',
        required: true,
        minLength: 8,
        maxLength: 50,
    })
    @IsString({ message: 'Le mot de passe doit etre une chaine de caracteres' })
    @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caracteres' })
    password: string;
}