import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Question } from './question.entity';
import { UserAnswers } from './user_answers.entity';
import { Skill } from './skill';
import { User } from './user.entity';
import { Position } from './position.entity';
import { InstitutionPosition } from './institution_position';

@Entity()
export class Institution {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(type => User, user => user.ownedInstitutions)
    owner: User;

    @OneToMany(type => InstitutionPosition, instpos => instpos.institution)
    institutionPositions: InstitutionPosition[];

}