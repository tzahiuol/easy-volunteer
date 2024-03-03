import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InstitutionPositionEntity } from 'src/entities/institution_position';
import { InstitutionPositionTimeSlotEntity } from 'src/entities/institution_position_timeslot';
import { UserEntity } from 'src/entities/user.entity';
import { UserErrorMessageException } from 'src/user-error-message/class';
import { Repository } from 'typeorm';
import { FilterInstitutionPositionsRequestDto } from './institution_positions.dto';

@Injectable()
export class InstitutionPositionsService {
    constructor(
        @InjectRepository(InstitutionPositionEntity)
        private institutionPositionRepo: Repository<InstitutionPositionEntity>,
        @InjectRepository(InstitutionPositionTimeSlotEntity)
        private institutionPositionTimeSlotRepo: Repository<InstitutionPositionTimeSlotEntity>,
        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>,
        private readonly userService: UserService
    ) { }

    async getSchedule(user_id: number) {
        return await this.institutionPositionTimeSlotRepo.find({ where: { users: { id: user_id } }, relations: ["institutionPosition"] })
    }

    getTimeslotScheduleInformation(timeslot_schedule: number): any {
        return this.institutionPositionTimeSlotRepo.findOne({ where: { id: timeslot_schedule }, relations: ["institutionPosition", "institutionPosition.position", "users","institutionPosition.institution"] })
    }

    async cancelSchedule(institiution_position_timeslot_id: number, user_id: number): Promise<any> {
        // get the timeslot, and delete the user from the timeslot
        const timeslot = await this.institutionPositionTimeSlotRepo.findOne({ where: { id: institiution_position_timeslot_id }, relations: ['users'] });
        const user = await this.userRepo.findOne({ where: { id: user_id } });
        timeslot.users = timeslot.users.filter((user) => user.id !== user_id);
        await this.institutionPositionTimeSlotRepo.save(timeslot);
    }

    async addSchedule(institiution_position_timeslot_id: number, user_id: number): Promise<boolean> {
        const timeslot = await this.institutionPositionTimeSlotRepo.findOne({ where: { id: institiution_position_timeslot_id }, relations: ['institutionPosition', 'institutionPosition.position', 'users'] });
        const avaliable_positions = await this.userService.getUserAvaliablePositions(user_id);

        if (avaliable_positions.find((pos) => pos.id === timeslot.institutionPosition.position.id) === undefined) {
            throw new UserErrorMessageException('User does not have the required skills for this position')
        }
        if (timeslot.users.length >= timeslot.amountRequired) {
            throw new UserErrorMessageException('Timeslot is full')
        }
        if (timeslot.users.find((user) => user.id === user_id) !== undefined) {
            throw new UserErrorMessageException('User is already in this timeslot')
        }
        const user = await this.userRepo.findOne({ where: { id: user_id } });
        timeslot.users.push(user);
        await this.institutionPositionTimeSlotRepo.save(timeslot);

        return true

    }

    async getCountries() {
        const rawData: { "country_code": string, "cities": string }[] = await this.institutionPositionRepo.manager
            .createQueryBuilder(InstitutionPositionEntity, "institution_position")
            .addGroupBy("institution_position.country_code")
            .select(["institution_position.country_code as country_code", "GROUP_CONCAT(DISTINCT(city) SEPARATOR ',') as cities"]).getRawMany()

        return rawData.map((data) => {
            return {
                country_code: data.country_code,
                cities: data.cities.split(",")
            }
        })
    }

    async filter(filterInstitutionPositionRequestDto: FilterInstitutionPositionsRequestDto, user_id: number): Promise<any> {
        const avaliable_positions = await this.userService.getUserAvaliablePositions(user_id);

        const query = this.institutionPositionTimeSlotRepo.createQueryBuilder("institution_position_timeslot")
        query.innerJoinAndSelect("institution_position_timeslot.institutionPosition", "institution_position")
        query.leftJoinAndSelect("institution_position_timeslot.users", "users")

        query.innerJoinAndSelect("institution_position.position", "position")
        query.innerJoinAndSelect("institution_position.institution", "institution")
        query.where("position.id IN (:...positions)", { positions: avaliable_positions.map((pos) => pos.id) })
        if ( filterInstitutionPositionRequestDto.country_code) {
            query.andWhere("country_code = :country_code", { country_code: filterInstitutionPositionRequestDto.country_code })
        }

        if ( filterInstitutionPositionRequestDto.city){
            query.andWhere("city = :city", { city: filterInstitutionPositionRequestDto.city })
        }

        if ( filterInstitutionPositionRequestDto.from){
            query.andWhere(" institution_position_timeslot.from >= STR_TO_DATE( :from , '%Y-%m-%d' ) ", { from: filterInstitutionPositionRequestDto.from })
        }
        if ( filterInstitutionPositionRequestDto.to){
            query.andWhere(" institution_position_timeslot.to <= STR_TO_DATE( :to , '%Y-%m-%d' ) ", { to: filterInstitutionPositionRequestDto.to })
        }

        const data : any = await query.getMany()
        
        
        return data.map((position) => {
            position.isAlreadyInPosition = position.users.find((user) => user.id === user_id) !== undefined
            position.amountOfUsers = position.users.length
            delete position.users
            return position
        })

    }
    
}
