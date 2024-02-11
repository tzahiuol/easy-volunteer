import { InstitutionEntity } from './institution.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany, JoinTable, OneToOne, JoinColumn } from 'typeorm';
import { QuestionEntity } from './question.entity';
import { UserAnswersEntity } from './user_answers.entity';
import { SkillEntity } from './skill';
import { UserEntity } from './user.entity';
import { PositionEntity } from './position.entity';
import { InstitutionPositionEntity } from './institution_position';

@Entity({name:"institution_position_timeslots"})
export class InstitutionPositionTimeSlotEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    from: Date

    @Column()
    to: Date

    @Column()
    amountRequired: number
    
    @ManyToOne(type => InstitutionPositionEntity, instpos => instpos.timeslots)
    institutionPosition: InstitutionPositionEntity;

    @ManyToMany(type => UserEntity)
    @JoinTable({name: "user_institution_position_timeslots"})
    users: UserEntity[];


}