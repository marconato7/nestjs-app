import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { ROLES_KEY } from "../decorators/roles.decorator";

export interface ExpressRequest extends Request
{
    user: any | null;
}

const SECRET_KEY = '123456123456123456123456123456123456123456123456123456123456';

@Injectable()
export class AuthzGuard implements CanActivate
{
    constructor
    (
        private readonly _jwtService: JwtService,
        private readonly _reflector: Reflector,
    ) {}

    canActivate(context: ExecutionContext): boolean
    {
        const request = context.switchToHttp().getRequest<ExpressRequest>();

        const getAll = this._reflector.getAll(ROLES_KEY, [ context.getClass(), context.getHandler(), ]);
        const getAllAndMerge = this._reflector.getAllAndMerge(ROLES_KEY, [ context.getClass(), context.getHandler(), ]);
        const getAllAndOverride = this._reflector.getAllAndOverride(ROLES_KEY, [ context.getClass(), context.getHandler(), ]);
        
        if(!request.headers.authorization) {
            return false;
        }
        const token = request.headers.authorization.split(' ')[1];
        try
        {
            request.user = this._jwtService.verify(token);            
        }
        catch(error)
        {
            throw error;
        }
        
        return true;
    }
}
