import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { QuestionEntity } from './entities/question.entity';
import { AnswerEntity } from './entities/answer.entity';
import { UserAnswersEntity } from './entities/user_answers.entity';
import { SkillEntity } from './entities/skill';
import { InstitutionEntity } from './entities/institution.entity';
import { PositionEntity } from './entities/position.entity';
import { InstitutionPositionEntity } from './entities/institution_position';
import { InstitutionPositionTimeSlotEntity } from './entities/institution_position_timeslot';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { QuestionService } from './question/question.service';
import { QuestionController } from './question/question.controller';
import { InstitutionPositionsController } from './institution_positions/institution_positions.controller';
import { InstitutionPositionsService } from './institution_positions/institution_positions.service';

const entities = [UserEntity, QuestionEntity, AnswerEntity, UserAnswersEntity, SkillEntity, InstitutionEntity, PositionEntity, InstitutionPositionEntity, InstitutionPositionTimeSlotEntity]

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'easy_volunteer',
      entities,
      synchronize: true,
    }),
    TypeOrmModule.forFeature(entities)
  ],
  controllers: [AppController, UserController, QuestionController, InstitutionPositionsController],
  providers: [AppService, UserService, QuestionService, InstitutionPositionsService],
})
export class AppModule { }
