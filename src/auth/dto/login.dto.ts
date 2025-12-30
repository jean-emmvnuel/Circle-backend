import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";


export class loginDto {
    @IsString({ message: 'Email doit être une chaîne de caractères' })
    @IsEmail({blacklisted_chars: "/,?{}[]#$%^&*()"},{ message: 'Email doit être une adresse email valide' })
    @IsNotEmpty({ message: 'Email est requis' })
    @ApiProperty({ example: 'name@gmail.com', description: 'Email', required: true })
    email: string;




    @IsString({ message: 'Password doit être une chaîne de caractères' })
    @MinLength(8, { message: 'Password doit contenir au moins 8 caractères' })
    @IsNotEmpty({ message: 'Password est requis' })
    @ApiProperty({ example: 'password', description: 'Password', required: true })
    password: string;
}