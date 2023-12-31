import { Institution } from './institution.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany, JoinTable, OneToOne, JoinColumn } from 'typeorm';
import { Question } from './question.entity';
import { UserAnswers } from './user_answers.entity';
import { Skill } from './skill';
import { User } from './user.entity';
import { Position } from './position.entity';
import { InstitutionPositionTimeSlot } from './institution_position_timeslot';

@Entity()
export class InstitutionPosition {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @ManyToOne(type => Institution, institution => institution.institutionPositions)
    institution: Institution;
  
    @ManyToOne(type => Position, position => position.institutionPositions)
    position: Position;

    @OneToMany(type => InstitutionPositionTimeSlot, instpostimeslot => instpostimeslot.institutionPosition)
    timeslots: InstitutionPosition[];

}