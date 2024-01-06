import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { AnswerEntity } from './answer.entity';
import { UserAnswersEntity } from './user_answers.entity';

@Entity()
export class QuestionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question: string;

  @OneToMany(type => AnswerEntity, answer => answer.question)
  answers: AnswerEntity[];

  @OneToMany(type => UserAnswersEntity, userAnswers => userAnswers.question)
  userAnswers: UserAnswersEntity[];

}