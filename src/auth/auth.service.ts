import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { registerDto } from './dto/register.dto';
import { loginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) { }

    async register(data: registerDto) {
        const { username, email, password } = data;

        const existingEmail = await this.prisma.user.findUnique({ where: { email } });
        if (existingEmail) {
            throw new ConflictException("un utilisateur avec ce mail existe deja");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.prisma.user.create({
            data: {
                username,
                email,
                role: "USER",
                password: hashedPassword,
            },
            select: {
                id: true,
                username: true,
                role: true,
                email: true,
                createdAt: true,
            },
        });
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const token = await this.jwtService.signAsync(payload);
        return {
            status: 201,
            message: "utilisateur creer avec succes",
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    createdAt: user.createdAt,
                },
                token,
            },
        }
    }

    async login(data: loginDto) {
        const { email, password } = data;

        const user = await this.prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                username: true,
                role: true,
                email: true,
                password: true,
                createdAt: true,
            },
        });
        if (!user) {
            throw new NotFoundException("utilisateur non trouve");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("mot de passe incorrect");
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const token = await this.jwtService.signAsync(payload);
        return {
            status: 200,
            message: "utilisateur connecte avec succes",
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    createdAt: user.createdAt,
                },
                token,
            },
        }
    }

    async validateUser(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
            },
        });
        if (!user) {
            throw new NotFoundException("utilisateur non trouve");
        }
        return user;
    }

    async logout() {
        return {
            status: 200,
            message: "Déconnexion réussie. Pensez à supprimer le token côté client.",
        };
    }
}
