import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnswerEntity } from 'src/entities/answer.entity';
import { QuestionEntity } from 'src/entities/question.entity';
import { UserEntity } from 'src/entities/user.entity';
import { UserAnswersEntity } from 'src/entities/user_answers.entity';
import { Repository } from 'typeorm';
import { AnswerQuestionDto, AnswerQuestionResponseDto } from './question.dto';

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

    async answerQuestion(userId: number, answerDto: AnswerQuestionResponseDto): Promise<Boolean> {
        const user = await this.userRepository.findOneByOrFail({ "id": userId });

        // Create transaction and save all answers at once
        this.answerRepository.manager.transaction(async manager => {
            const questionRepo = manager.getRepository(QuestionEntity)
            const answerRepo = manager.getRepository(AnswerEntity)
            const userAnswerRepo = manager.getRepository(UserAnswersEntity)

            for (const { questionId, answerId } of answerDto.answers) {
                const userAnswer = new UserAnswersEntity();
                userAnswer.user = user;
                userAnswer.question = await questionRepo.findOneByOrFail({ "id": questionId });

                const answer = await answerRepo.findOne({ where: { "id": answerId }, relations: ["question"] });
                if (!answer) {
                    throw "Answer does not exist"
                }
                if (answer.question.id != userAnswer.question.id) {
                    throw "Answer does not belong to question"
                }
                userAnswer.answer = answer;
                await userAnswerRepo.save(userAnswer);
            }
        })
        return true
    }
}
