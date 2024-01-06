import { IsEmail, IsNotEmpty, Max, Min } from 'class-validator';

export class GetQuestionsResponseDto {
    question: string;

    answers: string[];
}