import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany, JoinTable, OneToOne, JoinColumn } from 'typeorm';
import { Question } from './question.entity';
import { UserAnswers } from './user_answers.entity';
import { Skill } from './skill';
import { User } from './user.entity';
import { InstitutionPosition } from './institution_position';

@Entity()
export class Position {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @OneToOne(() => Skill)
    @JoinColumn()
    requiredSkill: Skill;

    @OneToMany(type => InstitutionPosition, instpos => instpos.position)
    institutionPositions: InstitutionPosition[];

}