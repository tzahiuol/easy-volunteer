import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Question } from './entities/question.entity';
import { Answer } from './entities/answer.entity';
import { UserAnswers } from './entities/user_answers.entity';
import { Skill } from './entities/skill';
import { Institution } from './entities/institution.entity';
import { Position } from './entities/position.entity';
import { InstitutionPosition } from './entities/institution_position';
import { InstitutionPositionTimeSlot } from './entities/institution_position_timeslot';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'easy_volunteer',
      entities: [User, Question, Answer, UserAnswers, Skill, Institution, Position, InstitutionPosition, InstitutionPositionTimeSlot],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
