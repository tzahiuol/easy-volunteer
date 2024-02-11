import { IsEmail, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class GetQuestionsResponseDto {
    question: string;

    answers: string[];
}

export class AnswerQuestionDto {
    @IsNotEmpty()
    @IsNumber()
    questionId: number;

    @IsNotEmpty()
    @IsNumber()
    answerId: number;
}