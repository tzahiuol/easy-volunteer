import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Answer } from './answer.entity';
import { Question } from './question.entity';
import { User } from './user.entity';

@Entity()
export class UserAnswers {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Answer, answer => answer.userAnswers)
  answer: Answer;

  @ManyToOne(type => Question, question => question.userAnswers)
  question: Question;

  @ManyToOne(type => User, user => user.userAnswers)
  user: User;

}