import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Answer } from './answer.entity';
import { UserAnswers } from './user_answers.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question: string;

  @OneToMany(type => Answer, answer => answer.question)
  answers: Answer[];

  @OneToMany(type => UserAnswers, userAnswers => userAnswers.question)
  userAnswers: UserAnswers[];

}