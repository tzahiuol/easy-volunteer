import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Connection, DataSource, Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { CreateUserDto, LoginDto } from './user.dtos';
import { PositionEntity } from 'src/entities/position.entity';

const saltRounds = 10

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
        @InjectDataSource() private readonly connection: DataSource
    ) { }

    async createUser(createUser: CreateUserDto) {
        const user = new UserEntity();
        user.email = createUser.email;
        const salt = await bcrypt.genSalt(saltRounds)
        const hashedPassword = await bcrypt.hash(createUser.password, salt)
        user.password = hashedPassword;
        user.salt = salt;
        user.firstName = createUser.firstName;
        user.lastName = createUser.lastName;
        await this.usersRepository.save(user);
        return true
    }

    async checkUserLogin(login: LoginDto) {
        const user = await this.usersRepository.findOneBy({ email: login.email })
        if (!user) {
            return false
        }
        const hashedPassword = await bcrypt.hash(login.password, user.salt)
        if (hashedPassword === user.password) {
            return user
        }
        return false
    }

    async getUser(id: number) {
        const user = await this.usersRepository.findOneByOrFail({ id: id });
        user.password = undefined;
        user.salt = undefined;
        return user;
    }

    async getUserAvaliablePositions(user_id: number): Promise<PositionEntity[]> {
        const data = await this.connection.createQueryRunner()
            .query(`
                SELECT positions.name, positions.id FROM users
                join user_answers on users.id = user_answers.userid
                join answers on user_answers.answerid = answers.id
                join answer_skills on answers.id = answer_skills.answersid
                join skills on answer_skills.skillsid = skills.id
                join positions on skills.id = positions.requiredSkillId
            WHERE users.id = ?`, [user_id])

        return data


    }
}
