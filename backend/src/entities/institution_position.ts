import { InstitutionEntity } from './institution.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany, JoinTable, OneToOne, JoinColumn } from 'typeorm';
import { QuestionEntity } from './question.entity';
import { UserAnswersEntity } from './user_answers.entity';
import { SkillEntity } from './skill';
import { UserEntity } from './user.entity';
import { PositionEntity } from './position.entity';
import { InstitutionPositionTimeSlotEntity } from './institution_position_timeslot';

@Entity({name:"institution_positions"})
export class InstitutionPositionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @ManyToOne(type => InstitutionEntity, institution => institution.institutionPositions)
    institution: InstitutionEntity;
  
    @ManyToOne(type => PositionEntity, position => position.institutionPositions)
    position: PositionEntity;

    @OneToMany(type => InstitutionPositionTimeSlotEntity, instpostimeslot => instpostimeslot.institutionPosition)
    timeslots: InstitutionPositionEntity[];

}