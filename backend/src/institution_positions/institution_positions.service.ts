import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InstitutionPositionEntity } from 'src/entities/institution_position';
import { InstitutionPositionTimeSlotEntity } from 'src/entities/institution_position_timeslot';
import { UserEntity } from 'src/entities/user.entity';
import { UserErrorMessageException } from 'src/user-error-message/class';
import { Repository } from 'typeorm';

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

    async addSchedule(institiution_position_timeslot_id: number, user_id: number): Promise<boolean> {
        const timeslot = await this.institutionPositionTimeSlotRepo.findOne({ where: { id: institiution_position_timeslot_id }, relations: ['institutionPosition', 'institutionPosition.position','users'] });
        console.log(timeslot)
        const avaliable_positions = await this.userService.getUserAvaliablePositions(user_id);

        console.log(avaliable_positions)
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
}
