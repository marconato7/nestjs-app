import { Controller, Get, Post, Body, InternalServerErrorException, Res, Req, Param } from '@nestjs/common';
import { HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegistrationRequest } from './dto/registration.request';
import { AuthService } from 'src/auth/auth.service';
import { UserResponse } from './dto/user.response';
import { Request, Response } from 'express';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { QueryBus } from '@nestjs/cqrs';
import { FollowUserCommand } from './follow-user.command';

@Controller()
export class UsersController
{
    readonly #authService: AuthService;
    readonly #usersService: UsersService;
    readonly #queryBus: QueryBus;

    constructor(authService: AuthService, usersService: UsersService, queryBus: QueryBus)
    {
        this.#authService = authService;
        this.#usersService = usersService;
        this.#queryBus = queryBus;
    }

    // Conduit endpoints

    @Auth(AuthType.None)
    @HttpCode(HttpStatus.OK)
    @Post('users/login')
    async signIn(@Body() request: any, @Res({ passthrough: true }) response: Response): Promise<any>
    {                
        const accessToken = await this.#authService.signIn(request);
        return accessToken;
        // response.cookie('access_token', accessToken, {
        //     secure: true,
        //     httpOnly: true,
        //     sameSite: true,
        // });
    }

    @Auth(AuthType.None)
    @Post('users')
    async registration(@Body() request: RegistrationRequest): Promise<UserResponse>
    {        
        const user = await this.#usersService.create(request);
        if (!user) {
            throw new InternalServerErrorException();
        }

        const userResponse = user.ToUserResponse();

        return userResponse;
    }

    @Auth(AuthType.Bearer)
    @Get('user')
    async getCurrentUser(@ActiveUser('email') userEmail: string, @Req() request: Request)
    {        
        const user = await this.#usersService.findByEmail(userEmail);

        return {
            user: {
                email: user.email,
                token: request.headers.authorization?.split(' ')[1],
                username: user.username,
                bio: user.bio,
                image: user.image,
            },
        };
    }

    // Returns a Profile    
    @Auth(AuthType.Bearer)
    @HttpCode(HttpStatus.OK)
    @Post('profiles/:username/follow')
    async followUser(@Param('username') username: string, @ActiveUser('email') email: string): Promise<any>
    {     
        const query = new FollowUserCommand(email, username);
        await this.#queryBus.execute(query);
    }
    
    // Unfollow user
    // DELETE /api/profiles/:username/follow
    
    // Authentication required, returns a Profile
    
    // No additional parameters required

    // Custom endpoints

    @Post('sign-up')
    async signUp(@Body() request: any): Promise<any>
    {
        await this.#authService.signUp(request);
        return;
    }

    // @Roles(['second'])
    // @Get('user')
    // getCurrentUser(request: ExpressRequest): any
    // {
    //     // if (!request.user) {
    //     //     throw new UnauthorizedException();
    //     // }

    //     return 'getCurrentUser';

    //     // const userResponse = this.buildUserResponse(request.user);

    //     // return userResponse;
    // }

    // @Public()
    // @Post('login')
    // async authentication(@Body() request: AuthenticationRequest): Promise<AuthenticationResponse>
    // {
    //     const user = await this._usersService.login(request);
    //     if (!user) {
    //         throw new InternalServerErrorException('Unable to login. Try Again.');
    //     }

    //     const registrationResponse = this.buildUserResponse(user);

    //     return registrationResponse;
    // }

    // @Roles([ 'admin', ])
    // @Get()
    // findAll() {
    //     return this.#usersService.findAll();
    // }

    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //     return this.#usersService.findOne(+id);
    // }

    @Auth(AuthType.None)
    @Get('users')
    async getAllUsers()
    {        
        return await this.#usersService.findAll();
    }

    // @Auth(AuthType.None)
    @HttpCode(HttpStatus.OK)
    @Post('refresh-tokens')
    refreshTokens(@Body() refreshTokenDto: any)
    {
        return this.#authService.refreshTokens(refreshTokenDto);
    }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    //     return this._usersService.update(+id, updateUserDto);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //     return this.usersService.remove(+id);
    // }

    // private buildUserResponse(userEntity: UserEntity): RegistrationResponse
    // private buildUserResponse(userEntity: any): RegistrationResponse
    // {
    //     return {
    //         username: userEntity.username,
    //         email: userEntity.email,
    //     };
    // }
}
