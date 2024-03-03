
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
import { UserEntity } from 'src/entities/user.entity';

const positions = [{ name: "Head Cook", skill: "Cooking" },
{ name: "Computer helpdesk", skill: "Computer Geek" },
{ name: "Driver", skill: "Driving" },
{ name: "Crisis Hotline Volunteer", skill: "People Person" },
{ name: "Tutor or Homework Helper", skill: "Children Care" },
{ name: "Courier", skill: "Carrier" },
{ name: "Warehouse Worker", skill: "Carrier++" },
{ name: "Carpenter's Assistant", skill: "Carrier++" },
{ name: "Animal Shelter Volunteer", skill: "Animal Handling" },
{ name: "Pet Therapy Volunteer", skill: "Animal Handling" },
{ name: "Zoo Volunteer", skill: "Animal Handling" }]

//  Position -> Skill
//  Answer -> Skill
async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    await createQuestionsAndPositions(app)

    await CreateInstitutionAndInstitutionPositions(app)

    await app.close()
}

const questions = [
    {
        "text": "How are you at cooking?", answers:
            [{ "text": "It will be a disaster" }, { "text": "I can cook a few things", }, { "text": "I'm a master chef", skills: ['Cooking'] },]
    },
    {
        "text": "How are you with computers?", answers:
            [{ "text": "Is it that squard thing?" }, { "text": "Sure, I know how to browse the internet", }, { "text": "Beep Boop, I use them so much I speak thier language", skills: ['Computer Geek'] },]
    },
    {
        "text": "Do you have a driver license?", answers:
            [{ "text": "Nope", }, { "text": "Yes!", skills: ['Driving'] }]
    },
    {
        "text": "Are you good with people?", answers:
            [{ "text": "Not really", }, { "text": "Not sure" }, { "text": "People? I love people!", skills: ['People Person'] }]
    },
    {
        "text": "Experience with children?", answers:
            [{ "text": "Not really", }, { "text": "No, but would be happy to volnuteer and help children", skills: ['Children Care'] }, { "text": "Yes, a lot, kids are the best", skills: ['Children Care'] }]
    },
    {
        "text": "Physical work?", answers:
            [{ "text": "Physical? not really my thing", }, { "text": "I can lift, but not too heavy", skills: ['Carrier'] }, { "text": "I can lift, brah!", skills: ['Carrier', 'Carrier++'] }]
    },
    {
        "text": "Are you good with animals?", answers:
            [{ "text": "Not really", }, { "text": "Only cats and dogs", skills: ['Animal Handling'] }, { "text": "Sure, love them all!", skills: ['Animal Handling'] }]
    },
    // {
    //     "text": "Is keeping the world clean important for you?", answers:
    //         [{ "text": "Sure, but its not really my thing", }, { "text": "I would love to contribute my time helping clean the world!" },]
    // }
]
const institutions = [
    {
        name: "Caring Hearts Foundation",
        description: "Dedicated to providing essential support and care to those in need.",
        institution_positions: [
            {
                name: "Nourish the Needy",
                description: "Join our team of compassionate chefs to prepare and deliver nutritious meals for the elderly.",
                position: positions[0],
                country_code: "UK",
                city: "London",
                full_address: "456 Kindness Lane, London, UK",
            },
            {
                name: "Tech for All",
                description: "Use your computer skills to assist individuals and organizations in need of technical support and solutions.",
                position: positions[1],
                country_code: "CA",
                city: "Toronto",
                full_address: "789 Innovation Street, Toronto, CA",
            },
            {
                name: "Drive to Thrive",
                description: "Help us make a difference by driving and delivering essential supplies to communities in need.",
                position: positions[2],
                country_code: "AU",
                city: "Sydney",
                full_address: "101 Journey Road, Sydney, AU",
            },
            {
                name: "Helping Hands Helpline",
                description: "Support individuals in crisis by volunteering for our helpline and providing a listening ear.",
                position: positions[3],
                country_code: "IN",
                city: "Mumbai",
                full_address: "567 Empathy Avenue, Mumbai, IN",
            },
            {
                name: "Educate Tomorrow",
                description: "Make a positive impact on young minds by becoming a tutor or homework helper for children in need.",
                position: positions[4],
                country_code: "FR",
                city: "Paris",
                full_address: "234 Knowledge Square, Paris, FR",
            },
        ]
    },
    {
        name: "Global Compassion Network",
        description: "Connecting compassionate individuals worldwide to create a global network of support and care.",
        institution_positions: [
            {
                name: "Swift Courier Relief",
                description: "Join our courier team to provide swift relief by delivering essential supplies to those in need.",
                position: positions[5],
                country_code: "DE",
                city: "Berlin",
                full_address: "789 Express Lane, Berlin, DE",
            },
            {
                name: "Shelter Builders Collective",
                description: "Assist in building shelters and homes for communities facing housing challenges.",
                position: positions[7],
                country_code: "JP",
                city: "Tokyo",
                full_address: "345 Carpentry Avenue, Tokyo, JP",
            },
            {
                name: "Animal Guardians Society",
                description: "Become a volunteer to care for and protect animals in shelters, promoting animal welfare.",
                position: positions[8],
                country_code: "MX",
                city: "Mexico City",
                full_address: "901 Pet Care Boulevard, Mexico City, MX",
            },
            {
                name: "Joyful Paws Project",
                description: "Spread joy and comfort by volunteering in local zoos and participating in pet therapy programs.",
                position: positions[9],
                country_code: "ZA",
                city: "Cape Town",
                full_address: "112 Zoo Lane, Cape Town, ZA",
            }
        ]
    }
];

async function createQuestionsAndPositions(app: INestApplicationContext) {
    const questionRepo: Repository<QuestionEntity> = app.get(getRepositoryToken(QuestionEntity));
    const answersRepo: Repository<AnswerEntity> = app.get(getRepositoryToken(AnswerEntity));
    const skillRepo: Repository<SkillEntity> = app.get(getRepositoryToken(SkillEntity));
    const positionRepo: Repository<PositionEntity> = app.get(getRepositoryToken(PositionEntity));
    const institutionRepo: Repository<InstitutionEntity> = app.get(getRepositoryToken(InstitutionEntity));
    const institutionPositionRepo: Repository<InstitutionPositionEntity> = app.get(getRepositoryToken(InstitutionPositionEntity));
    const InstitutionPositionTimeSlotRepo: Repository<InstitutionPositionTimeSlotEntity> = app.get(getRepositoryToken(InstitutionPositionTimeSlotEntity));
    const userRepo: Repository<UserEntity> = app.get(getRepositoryToken(UserEntity))

    console.log("Deleting all questions related")
    await InstitutionPositionTimeSlotRepo.delete({})
    await institutionPositionRepo.delete({})
    await institutionRepo.delete({})
    await positionRepo.delete({})
    await questionRepo.delete({})
    await answersRepo.delete({})
    await skillRepo.delete({})
    await userRepo.delete({})

    const savedSkills: { [key: string]: SkillEntity } = {}

    console.log("Creating skills")
    const skills = new Set<string>()
    for (const question of questions) {
        for (const answer of question.answers) {
            if (answer.skills) {
                for (const skill of answer.skills) {
                    skills.add(skill)
                }
            }
        }
    } 

    for (const skill of skills) {
        const skillEntity = new SkillEntity()
        skillEntity.name = skill
        console.log(`Creating skill ${skillEntity.name}`)
        savedSkills[skillEntity.name] = await skillRepo.save(skillEntity)
    }
    console.log("Creating positions")
    for (const position of positions) {
        const positionEntity = new PositionEntity()
        positionEntity.name = position.name
        positionEntity.requiredSkill = savedSkills[position.skill]

        console.log(`Creating position ${positionEntity.name}`)
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

function generateRandomDateRange() {
    const dateRanges = [];

    // Get today's date
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + -2); // Start from 2 days ago

    const amountOfDays = getRandomNumber(5, 30)
    const endDate = new Date(currentDate);
    endDate.setDate(currentDate.getDate() + amountOfDays);

    // Generate date ranges for every other day
    while (currentDate < endDate) {
        const fromDate = new Date(currentDate);
        const start = getRandomNumber(8,10)
        const delta = getRandomNumber(1, 3)
        fromDate.setHours(start, 0, 0, 0);

        const toDate = new Date(currentDate);
        toDate.setHours(start + delta, 0, 0, 0);

        dateRanges.push({ from: fromDate, to: toDate });

        const amountOfDaysToJump = getRandomNumber(1, 5)
        // Move to the next day
        currentDate.setDate(currentDate.getDate() + amountOfDaysToJump);
    }

    return dateRanges;
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
async function CreateInstitutionAndInstitutionPositions(app: INestApplicationContext) {
    const institutionRepo: Repository<InstitutionEntity> = app.get(getRepositoryToken(InstitutionEntity));
    const institutionPositionRepo: Repository<InstitutionPositionEntity> = app.get(getRepositoryToken(InstitutionPositionEntity));
    const InstitutionPositionTimeSlotRepo: Repository<InstitutionPositionTimeSlotEntity> = app.get(getRepositoryToken(InstitutionPositionTimeSlotEntity));
    const positionRepo: Repository<PositionEntity> = app.get(getRepositoryToken(PositionEntity));


    console.log("Creating institutions and positions")
    for (let institution of institutions) {
        const institutionEntity = new InstitutionEntity()
        institutionEntity.name = institution.name
        institutionEntity.description = institution.description
        await institutionRepo.save(institutionEntity)

        console.log(`Creating positions for institution ${institutionEntity.name}`)
        for (const instPosition of institution.institution_positions) {
            const institutionPositionEntity = new InstitutionPositionEntity()
            institutionPositionEntity.name = instPosition.name
            institutionPositionEntity.description = instPosition.description
            institutionPositionEntity.institution = institutionEntity
            const position = await positionRepo.findOneBy({ name: instPosition.position.name })
            institutionPositionEntity.position = position
            institutionPositionEntity.country_code = instPosition.country_code
            institutionPositionEntity.city = instPosition.city
            institutionPositionEntity.fullAddress = instPosition.full_address
            await institutionPositionRepo.save(institutionPositionEntity)

            for (const slot of generateRandomDateRange()) {
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
