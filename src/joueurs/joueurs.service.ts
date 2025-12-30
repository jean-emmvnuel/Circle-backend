import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class JoueursService {
    constructor(private readonly prisma: PrismaService) {}

    async getAllJoueurs() {
        return await this.prisma.player.findMany();
    }

    async getOneJoueur(id: number) {
        const joueur = await this.prisma.player.findUnique({
            where: { id: id },
        });
        if (!joueur) {
            throw new NotFoundException('Aucun joueur avec cet id');
        }
        return joueur;
    }

    async createJoueur(data) {
        const joueurExist = await this.prisma.player.findFirst({
            where: { nom: data.nom },
        });
        if (joueurExist) {
            throw new BadRequestException(
                'Ce joueur existe déjà, veuillez choisir un autre',
            );
        }

        return await this.prisma.player.create({
            data,
        });
    }

    async updateJoueur(id: number, data) {
        const joueurExist = await this.prisma.player.findUnique({
            where: { id: id },
        });
        if (!joueurExist) {
            throw new NotFoundException('Aucun joueur avec cet id, on ne peut pas le modifier');
        }
        return await this.prisma.player.update({
            where: { id: id },
            data,
        })
    }

    async deleteJoueur(id: number) {
        const joueurExist = await this.prisma.player.findFirst({
            where: { id: id },
        });
        if (!joueurExist) {
            throw new NotFoundException('Aucun joueur avec cet id, on ne peut pas le supprimer');
        }
        return await this.prisma.player.delete({
            where: { id: id },
        })
    }
}
