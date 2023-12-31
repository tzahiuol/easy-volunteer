import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Question } from './question.entity';
import { UserAnswers } from './user_answers.entity';
import { Answer } from './answer.entity';

@Entity()
export class Skill {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(type => Answer)
    answers: Answer[];

}