import { User } from 'src/user/user.decorator';
import { QuestionService } from './question.service';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/entities/user.entity';
import { UserLoginGuard } from 'src/user/user-login.guard';
import { QuestionEntity } from 'src/entities/question.entity';
import { AnswerQuestionDto, AnswerQuestionResponseDto } from './question.dto';

@Controller('question')
@UseGuards(UserLoginGuard)
export class QuestionController {
    constructor(private readonly QuestionService: QuestionService) { }

    @Get("/should-answer-questions")
    async shouldAnswerQuestions(@User() user: UserEntity): Promise<{result: Boolean} > {
        return {
            result: await this.QuestionService.shouldAnswerQuestions(user.id)
        }
    }

    @Get("/list")
    async getQuestions(): Promise<QuestionEntity[]> {
        return await this.QuestionService.getQuestionsForAnswer();
    }

    @Post("/answer")
    async answer(@User() user: UserEntity, @Body() answersDto: AnswerQuestionResponseDto): Promise<Boolean> {
        await this.QuestionService.answerQuestion(user.id, answersDto);
        return null
    }
}
