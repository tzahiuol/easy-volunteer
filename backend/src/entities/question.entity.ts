import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { AnswerEntity } from './answer.entity';
import { UserAnswersEntity } from './user_answers.entity';

@Entity({name:"questions"})
export class QuestionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question: string;

  @OneToMany(type => AnswerEntity, answer => answer.question, { onDelete: 'CASCADE' })
  answers: AnswerEntity[];

  @OneToMany(type => UserAnswersEntity, userAnswers => userAnswers.question, { onDelete: 'CASCADE' })
  userAnswers: UserAnswersEntity[];

}