import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Question } from './question.entity';
import { UserAnswers } from './user_answers.entity';
import { Skill } from './skill';

@Entity()
export class Answer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    answer: string;

    @Column()
    order: number;

    @ManyToOne(type => Question, question => question.answers)
    question: Question;

    @OneToMany(type => UserAnswers, userAnswers => userAnswers.answer)
    userAnswers: UserAnswers[];

    @ManyToMany(type => Skill)
    @JoinTable({name: 'answer_skills'})
    skills: Skill[];

}