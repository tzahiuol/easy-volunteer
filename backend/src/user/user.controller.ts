import { QueryFailedError } from 'typeorm';
import { CreateUserDto, LoginDto } from './user.dtos';
import { UserService } from './user.service';
import { Body, Controller, Get, Post, Req, Res, Session, UseGuards } from '@nestjs/common';
import { UserLoginGuard } from './user-login.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('/login')
    async login(@Body() login: LoginDto, @Session() session: Record<string, any>): Promise<Boolean> {
        const user = await this.userService.checkUserLogin(login);

        if (!user) {
            return false;
        }
        session['user'] = user
        return true;
    }

    @Post("/register")
    async register(@Body() createUserDto: CreateUserDto, @Res() response): Promise<Boolean> {
        try {
            await this.userService.createUser(createUserDto);
            response.status(200).send()
        } catch (e) {
            if (e instanceof QueryFailedError) {
                if (e.driverError.code === 'ER_DUP_ENTRY') {
                    response.status(409).send()
                    return false
                }
            }
            response.status(500).send()
        }
    }

    @UseGuards(UserLoginGuard)
    @Get("/me")
    async me(@Session() session: Record<string, any>): Promise<any> {
        return this.userService.getUser(session['user'].id);
    }

}
