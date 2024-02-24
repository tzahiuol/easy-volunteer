
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { QuestionService } from 'src/question/question.service';
import { QuestionEntity } from 'src/entities/question.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getManager } from 'typeorm';
import { INestApplicationContext, Logger } from '@nestjs/common';

import { Repository } from 'typeorm';
import { AnswerEntity } from 'src/entities/answer.entity';
import { SkillEntity } from 'src/entities/skill';
import { PositionEntity } from 'src/entities/position.entity';
import { InstitutionEntity } from 'src/entities/institution.entity';
import { InstitutionPositionEntity } from 'src/entities/institution_position';
import { InstitutionPositionTimeSlotEntity } from 'src/entities/institution_position_timeslot';

const positions = [{ name: "Head Cook", skill: "Cooking" }]
async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    await createQuestionsAndPositions(app)

    await CreateInstitutionAndInstitutionPositions(app)

    await app.close()
}

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

async function createQuestionsAndPositions(app: INestApplicationContext) {
    const questionRepo: Repository<QuestionEntity> = app.get(getRepositoryToken(QuestionEntity));
    const answersRepo: Repository<AnswerEntity> = app.get(getRepositoryToken(AnswerEntity));
    const skillRepo: Repository<SkillEntity> = app.get(getRepositoryToken(SkillEntity));
    const positionRepo: Repository<PositionEntity> = app.get(getRepositoryToken(PositionEntity));

    const amountOfQuestions = await questionRepo.count()

    console.log("Deleting all questions related")
    if (amountOfQuestions > 0) {
        await positionRepo.delete({})
        await questionRepo.delete({})
        await answersRepo.delete({})
        await skillRepo.delete({})
    }

    const savedSkills: { [key: string]: SkillEntity } = {}

    console.log("Creating skills")
    for (const skill of skills) {
        const skillEntity = new SkillEntity()
        skillEntity.name = skill
        savedSkills[skillEntity.name] = await skillRepo.save(skillEntity)
    }
    console.log("Creating positions")
    for (const position of positions) {
        const positionEntity = new PositionEntity()
        positionEntity.name = position.name
        positionEntity.requiredSkill = savedSkills[position.skill]
        await positionRepo.save(positionEntity)
    }


    console.log("Creating questions")
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
}

function generateDateRange() {
    const dateRanges = [];

    // Get today's date
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 2); // Start from 2 days from now

    // Calculate date for 3 weeks from now
    const endDate = new Date(currentDate);
    endDate.setDate(currentDate.getDate() + 21);

    // Generate date ranges for every other day
    while (currentDate < endDate) {
        const fromDate = new Date(currentDate);
        fromDate.setHours(13, 0, 0, 0);

        const toDate = new Date(currentDate);
        toDate.setHours(18, 0, 0, 0);

        dateRanges.push({ from: fromDate, to: toDate });

        // Move to the next other day
        currentDate.setDate(currentDate.getDate() + 2);
    }

    return dateRanges;
}

const institutions = [
    {
        name: "Cooks for you",
        institution_positions: [
            {
                name: "Cooking for the elderly",
                position: positions[0],
                country_code: "UK",
                city: "London",
                full_address: "123 Fake Street, London, UK",
                slots: generateDateRange()
            }
        ]
    }
]
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
async function CreateInstitutionAndInstitutionPositions(app: INestApplicationContext) {
    const institutionRepo: Repository<InstitutionEntity> = app.get(getRepositoryToken(InstitutionEntity));
    const institutionPositionRepo: Repository<InstitutionPositionEntity> = app.get(getRepositoryToken(InstitutionPositionEntity));
    const InstitutionPositionTimeSlotRepo: Repository<InstitutionPositionTimeSlotEntity> = app.get(getRepositoryToken(InstitutionPositionTimeSlotEntity));
    const positionRepo: Repository<PositionEntity> = app.get(getRepositoryToken(PositionEntity));


    const amountOfInstitutions = await institutionRepo.count()

    console.log("Deleting institutions related")
    if (amountOfInstitutions > 0) {
        await institutionPositionRepo.delete({})
        await institutionRepo.delete({})
    }

    console.log("Creating institutions and positions")
    for (let institution of institutions) {
        const institutionEntity = new InstitutionEntity()
        institutionEntity.name = institution.name
        await institutionRepo.save(institutionEntity)

        console.log("Creating positions for institution")
        for (const instPosition of institution.institution_positions) {
            const institutionPositionEntity = new InstitutionPositionEntity()
            institutionPositionEntity.name = instPosition.name
            institutionPositionEntity.institution = institutionEntity
            const position = await positionRepo.findOneBy({ name: instPosition.position.name })
            institutionPositionEntity.position = position
            institutionPositionEntity.country_code = instPosition.country_code
            institutionPositionEntity.city = instPosition.city
            institutionPositionEntity.fullAddress = instPosition.full_address
            await institutionPositionRepo.save(institutionPositionEntity)

            console.log("Creating time slots for position")
            for (const slot of instPosition.slots) {
                const slotEntity = new InstitutionPositionTimeSlotEntity()
                slotEntity.from = slot.from
                slotEntity.to = slot.to
                slotEntity.institutionPosition = institutionPositionEntity
                slotEntity.amountRequired = getRandomNumber(1, 3)
                await InstitutionPositionTimeSlotRepo.save(slotEntity)
            }
        }
    }

}
bootstrap();
