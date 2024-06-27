import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
// import { UserEntity } from '../entities/user.entity';
import { verify } from 'jsonwebtoken';
import { UsersService } from '../users.service';

export interface ExpressRequest extends Request
{
    // user: UserEntity | null;
    user: any | null;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware
{
    readonly #usersService: UsersService;

    constructor(usersService: UsersService)
    {
        this.#usersService = usersService;
    }

    async use(request: ExpressRequest, response: Response, next: NextFunction)
    {
        if (!request.headers['authorization'])
        {
            request.user = null;
            return next();
        }

        const token = request.headers['authorization']!.split(' ')[1];

        try
        {
            const decode = verify(token, process.env.JWT_SECRET || 'abc') as { email: string; };

            const user = await this.#usersService.findByEmail(decode.email);
            if (user) {
                request.user = user;
                next();
            }

            request.user = null;
            next();
        }
        catch (err)
        {
            request.user = null;
            next();
        }
    }
}
