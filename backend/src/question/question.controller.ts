import { User } from 'src/user/user.decorator';
import { QuestionService } from './question.service';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/entities/user.entity';
import { UserLoginGuard } from 'src/user/user-login.guard';
import { QuestionEntity } from 'src/entities/question.entity';
import { AnswerQuestionDto } from './question.dtos';

@Controller('question')
@UseGuards(UserLoginGuard)
export class QuestionController {
    constructor(private readonly QuestionService: QuestionService) { }

    @Get("/shouldAnswerQuestions")
    async shouldAnswerQuestions(@User() user: UserEntity): Promise<Boolean> {
        return await this.QuestionService.shouldAnswerQuestions(user.id);
    }

    @Get("/list")
    async getQuestions(): Promise<QuestionEntity[]> {
        return await this.QuestionService.getQuestionsForAnswer();
    }

    @Post("/answer")
    async answer(@User() user: UserEntity, @Body() answerDto: AnswerQuestionDto): Promise<Boolean> {
        await this.QuestionService.answerQuestion(user.id, answerDto.questionId, answerDto.answerId);
        return null
    }
}
