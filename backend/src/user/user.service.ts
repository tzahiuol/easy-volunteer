import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { CreateUserDto, LoginDto } from './user.dtos';

const saltRounds = 10

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
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
}
