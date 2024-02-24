import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Connection, DataSource, Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { CreateUserDto, LoginDto } from './user.dto';
import { PositionEntity } from 'src/entities/position.entity';
import { UserErrorMessageException } from 'src/user-error-message/class';

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
        const user = await this.usersRepository.findOne({ where: {email: login.email }, select: ['id', 'password', 'salt','firstName', 'lastName', 'email'] })
        if (!user) {
            throw new UserErrorMessageException('Invalid authentication', 401)
        }
        const hashedPassword = await bcrypt.hash(login.password, user.salt)
        if (hashedPassword === user.password) {
            return user
        }
        throw new UserErrorMessageException('Invalid authentication', 401)
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
