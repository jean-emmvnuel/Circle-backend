import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { createTeamDto } from './dto/createTeam.tdo';
import { updateTeamDto } from './dto/updateTeam.dto';

@Injectable()
export class EquipesService {
    constructor(private readonly prisma: PrismaService) {}

    async getAllEquipes() {
        return await this.prisma.team.findMany();
    }

    async getOneEquipe(id: number) {
        const equipe = await this.prisma.team.findUnique({
            where: { id: id },
        });
        if (!equipe) {
            throw new NotFoundException('Aucune equipe avec cet id');
        }
        return equipe;
    }

    async createEquipe(data:createTeamDto) {
        const equipeExist = await this.prisma.team.findFirst({
            where: { nom: data.nom },
        });
        if (equipeExist) {
            throw new BadRequestException(
                'Cette equipe existe déjà, veuillez choisir un autre',
            );
        }

        return await this.prisma.team.create({
            data,
        });
    }

    async updateEquipe(id: number, data:updateTeamDto) {
        const equipeExist = await this.prisma.team.findUnique({
            where: { id: id },
        });
        if (!equipeExist) {
            throw new NotFoundException('Aucune equipe avec cet id, on ne peut pas la modifier');
        }
        return await this.prisma.team.update({
            where: { id: id },
            data,
        })
    }   

    async deleteEquipe(id: number) {
        const equipeExist = await this.prisma.team.findFirst({
            where: { id: id },
        });
        if (!equipeExist) {
            throw new NotFoundException('Aucune equipe avec cet id, on ne peut pas la supprimer');
        }
        return await this.prisma.team.delete({
            where: { id: id },
        })
    }
}
