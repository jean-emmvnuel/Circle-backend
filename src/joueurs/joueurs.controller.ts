import { Controller, Get, Param, Post, Put, Delete, Body, ParseIntPipe } from '@nestjs/common';
import { JoueursService } from './joueurs.service';

@Controller('joueurs')
export class JoueursController {
    constructor(private readonly joueursService: JoueursService) {}

    @Get()
    getAllJoueurs() {
        return this.joueursService.getAllJoueurs();
    }

    @Get('/:id')
    getOneJoueur(@Param('id', ParseIntPipe) id: number) {
        return this.joueursService.getOneJoueur(id);
    }

    @Post()
    createJoueur(@Body() data) {
        return this.joueursService.createJoueur(data);
    }

    @Put('/:id')
    updateJoueur(@Param('id', ParseIntPipe) id: number, @Body() data) {
        return this.joueursService.updateJoueur(id, data);
    }

    @Delete('/:id')
    deleteJoueur(@Param('id', ParseIntPipe) id: number) {
        return this.joueursService.deleteJoueur(id);
    }
}
