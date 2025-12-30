import { Body, Controller, Get, Param, Post, Put, Delete } from '@nestjs/common';
import { PositionsService } from './positions.service';

@Controller('positions')
export class PositionsController {
    constructor(private readonly positionsService: PositionsService) {}
    @Get('/all')
    getAllPosition() {
        return this.positionsService.getAllPositions();
    }

    @Get('/one/:id')
    getOnePosition(@Param('id') id: string) {
        return this.positionsService.getOnePosition(Number(id));
    }

    @Post('/create')
    createPosition(@Body() data) {
        return this.positionsService.createPosition(data);
    }

    @Put('/update/:id')
    updatePosition(@Param('id') id: string, @Body() data) {
        return this.positionsService.updatePosition(Number(id), data);
    }

    @Delete('/delete/:id')
    deletePosition(@Param('id') id: string) {
        return this.positionsService.deletePosition(Number(id));
    }
}
