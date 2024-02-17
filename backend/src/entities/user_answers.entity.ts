import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, Unique } from 'typeorm';
import { AnswerEntity } from './answer.entity';
import { QuestionEntity } from './question.entity';
import { UserEntity } from './user.entity';

@Entity({"name":"user_answers"})
@Unique('question_user', ['question', 'user'])
export class UserAnswersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => AnswerEntity, answer => answer.userAnswers,  { onDelete: 'CASCADE' })
  answer: AnswerEntity;

  @ManyToOne(type => QuestionEntity, question => question.userAnswers,  { onDelete: 'CASCADE' })
  question: QuestionEntity;

  @ManyToOne(type => UserEntity, user => user.userAnswers)
  user: UserEntity;

}