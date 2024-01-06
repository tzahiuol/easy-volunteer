import { User } from 'src/user/user.decorator';
import { QuestionService } from './question.service';
import { Controller, Get } from '@nestjs/common';
import { UserEntity } from 'src/entities/user.entity';

@Controller('question')
export class QuestionController {
    constructor(private readonly QuestionService: QuestionService) { }

    @Get("/shouldAnswerQuestions")
    async shouldAnswerQuestions(@User() user: UserEntity): Promise<Boolean> {
        console.log(user)
        return await this.QuestionService.shouldAnswerQuestions(user.id);
    }

}
