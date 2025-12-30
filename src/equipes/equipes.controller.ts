import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { EquipesService } from './equipes.service';
import { createTeamDto } from './dto/createTeam.tdo';
import { updateTeamDto } from './dto/updateTeam.dto';

@Controller('equipes')
export class EquipesController {
    constructor(private readonly equipesService: EquipesService) {}
    
    @Get()
    getAllEquipes() {
        return this.equipesService.getAllEquipes();
    }

    @Get('/:id')
    getOneEquipe(@Param('id') id: string) {
        return this.equipesService.getOneEquipe(Number(id));
    }

    @Post()
    createEquipe(@Body() data:createTeamDto) {
        return this.equipesService.createEquipe(data);
    }

    @Put('/:id')
    updateEquipe(@Param('id') id: string, @Body() data:updateTeamDto) {
        return this.equipesService.updateEquipe(Number(id), data);
    }

    @Delete('/:id')
    deleteEquipe(@Param('id') id: string) {
        return this.equipesService.deleteEquipe(Number(id));
    }
}
