import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { QuestionEntity } from './question.entity';
import { UserAnswersEntity } from './user_answers.entity';
import { SkillEntity } from './skill';

@Entity({name:"answers"})
export class AnswerEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    answer: string;

    @Column()
    order: number;

    @ManyToOne(type => QuestionEntity, question => question.answers, { onDelete: 'CASCADE' })
    question: QuestionEntity;

    @OneToMany(type => UserAnswersEntity, userAnswers => userAnswers.answer, { onDelete: 'CASCADE' })
    userAnswers: UserAnswersEntity[];

    @ManyToMany(type => SkillEntity)
    @JoinTable({name: 'answer_skills'})
    skills: SkillEntity[];

}