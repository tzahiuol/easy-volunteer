import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionEntity } from 'src/entities/question.entity';
import { UserAnswersEntity } from 'src/entities/user_answers.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionService {
    constructor(
        @InjectRepository(QuestionEntity)
        private questionRepository: Repository<QuestionEntity>,
        @InjectRepository(UserAnswersEntity)
        private userAnswersRepository: Repository<UserAnswersEntity>,
    ) { }

    async shouldAnswerQuestions(userId: number): Promise<Boolean> {
        const answer = await this.userAnswersRepository.findOneBy({ "user": { "id": userId } });
        return answer == null
    }
}
