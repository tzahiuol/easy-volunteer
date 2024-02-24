import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsNotEmpty, IsNumber, Max, Min, ValidateNested } from 'class-validator';


export class AnswerQuestionResponseDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AnswerQuestionDto)
    answers: AnswerQuestionDto[];
}

export class AnswerQuestionDto {
    @IsNotEmpty()
    @IsNumber()
    questionId: number;

    @IsNotEmpty()
    @IsNumber()
    answerId: number;
}