import { Institution } from './institution.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany, JoinTable, OneToOne, JoinColumn } from 'typeorm';
import { Question } from './question.entity';
import { UserAnswers } from './user_answers.entity';
import { Skill } from './skill';
import { User } from './user.entity';
import { Position } from './position.entity';
import { InstitutionPosition } from './institution_position';

@Entity()
export class InstitutionPositionTimeSlot {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    from: Date

    @Column()
    to: Date

    @Column()
    amountRequired: number
    
    @ManyToOne(type => InstitutionPosition, instpos => instpos.timeslots)
    institutionPosition: InstitutionPosition;

    @ManyToMany(type => User)
    @JoinTable()
    users: User[];


}