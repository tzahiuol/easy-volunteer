import { Body, Controller, Get, Param, Post, Req, Session, UseGuards } from '@nestjs/common';
import { InstitutionPositionsService } from './institution_positions.service';
import { UserLoginGuard } from 'src/user/user-login.guard';
import { FilterInstitutionPositionsRequestDto } from './institution_positions.dtos';

@Controller('institution-positions')
@UseGuards(UserLoginGuard)
export class InstitutionPositionsController {
    constructor(private readonly instututionPositionService: InstitutionPositionsService) { }


    @Get("/schedule")
    async get_schedule(@Session() session: Record<string, any>): Promise<any> {
        return await this.instututionPositionService.getSchedule(session['user'].id);
    }

    @Post("/schedule/timeslot/:id")
    async post_schedule(@Param('id') id: number, @Session() session: Record<string, any>): Promise<any> {
        return await this.instututionPositionService.addSchedule(id, session['user'].id);
    }

    @Get("/filter/countries")
    async get_countries(): Promise<any> {
        return await this.instututionPositionService.getCountries();
    }

    @Post("/filter")
    async filter(@Body() filterInstitutionPositionRequestDto: FilterInstitutionPositionsRequestDto, @Session() session: Record<string, any>): Promise<any> {
        return await this.instututionPositionService.filter(filterInstitutionPositionRequestDto, session['user'].id);
    }

}
