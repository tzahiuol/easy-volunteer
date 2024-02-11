
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { QuestionService } from 'src/question/question.service';
import { QuestionEntity } from 'src/entities/question.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getManager } from 'typeorm';
import { Logger } from '@nestjs/common';

import { Repository } from 'typeorm';
import { AnswerEntity } from 'src/entities/answer.entity';
import { SkillEntity } from 'src/entities/skill';
import { PositionEntity } from 'src/entities/position.entity';

const questions = [
    {
        "text": "How are you at cooking?", answers:
            [{ "text": "I can't cook" }, { "text": "I can cook a few things", }, { "text": "I'm a master chef", skills: ['Cooking'] },]
    },
    {
        "text": "How are you with computers?", answers:
        [{ "text": "I can't cook" }, { "text": "I can cook a few things", }, { "text": "I'm a master chef", skills: ['Cooking'] },]
    }
]
const skills = ["Cooking", "Computers", "Taking care of elderly", "Taking care of children", "Teaching"]

const positions = [{name:"Head Cook",skill:"Cooking"}]
async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const questionRepo: Repository<QuestionEntity> = app.get(getRepositoryToken(QuestionEntity));
    const answersRepo: Repository<AnswerEntity> = app.get(getRepositoryToken(AnswerEntity));
    const skillRepo: Repository<SkillEntity> = app.get(getRepositoryToken(SkillEntity));
    const positionRepo: Repository<PositionEntity> = app.get(getRepositoryToken(PositionEntity));
    
    const amountOfQuestions = await questionRepo.count()

    if (amountOfQuestions > 0) {
        await positionRepo.delete({})
        await questionRepo.delete({})
        await answersRepo.delete({})
        await skillRepo.delete({})
    }

    const savedSkills: { [key: string]: SkillEntity } = {}

    for (const skill of skills) {
        const skillEntity = new SkillEntity()
        skillEntity.name = skill
        savedSkills[skillEntity.name] = await skillRepo.save(skillEntity)
    }

    for (const position of positions) {
        const positionEntity = new PositionEntity()
        positionEntity.name = position.name
        positionEntity.requiredSkill = savedSkills[position.skill]
        await positionRepo.save(positionEntity)
    }


    for (const question of questions) {
        let questionEntity = new QuestionEntity()
        questionEntity.question = question.text

        questionEntity = await questionRepo.save(questionEntity)
        const answers = question.answers.map((answer, index) => {
            const answerEntity = new AnswerEntity()
            answerEntity.answer = answer.text
            answerEntity.order = index
            answerEntity.question = questionEntity
            if (answer.skills && answer.skills.length > 0) {
                answerEntity.skills = answer.skills.map(skill => savedSkills[skill])
            }
            return answerEntity
        })
        await answersRepo.save(answers)
    }


    await app.close()
}
bootstrap();
