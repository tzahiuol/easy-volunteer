import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnswerEntity } from 'src/entities/answer.entity';
import { QuestionEntity } from 'src/entities/question.entity';
import { UserEntity } from 'src/entities/user.entity';
import { UserAnswersEntity } from 'src/entities/user_answers.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionService {
    constructor(
        @InjectRepository(QuestionEntity)
        private questionRepository: Repository<QuestionEntity>,
        @InjectRepository(UserAnswersEntity)
        private userAnswersRepository: Repository<UserAnswersEntity>,
        @InjectRepository(AnswerEntity)
        private answerRepository: Repository<AnswerEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) { }

    async shouldAnswerQuestions(userId: number): Promise<Boolean> {
        const answer = await this.userAnswersRepository.findOneBy({ "user": { "id": userId } });
        return answer == null
    }

    async getQuestionsForAnswer(): Promise<QuestionEntity[]> {
        return await this.questionRepository.find({ relations: ["answers"] });
    }

    async answerQuestion(userId: number, questionId: number, answerId: number): Promise<Boolean> {
        const userAnswer = new UserAnswersEntity();

        userAnswer.user = await this.userRepository.findOneByOrFail({ "id": userId });
        userAnswer.question = await this.questionRepository.findOneByOrFail({ "id": questionId });
        
        const answer = await this.answerRepository.findOne({ where:{"id": answerId}, relations: ["question"] });
        if (!answer) {
            throw "Answer does not exist"
        }
        if (answer.question.id != userAnswer.question.id) {
            throw "Answer does not belong to question"
        }
        userAnswer.answer = answer;
        await this.userAnswersRepository.save(userAnswer);
        return true
    }
}
