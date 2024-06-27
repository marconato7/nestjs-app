import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import jwtConfig from "../jwt.config";
import { REQUEST_USER_KEY } from "../auth.constants";

export interface ExpressRequest extends Request
{
    user: any | null;
}

@Injectable()
export class AccessTokenGuard implements CanActivate
{
    readonly #jwtService: JwtService;
    readonly #jwtConfiguration: ConfigType<typeof jwtConfig>;

    constructor(jwtService: JwtService, @Inject(jwtConfig.KEY) jwtConfiguration: ConfigType<typeof jwtConfig>)
    {
        this.#jwtService = jwtService;
        this.#jwtConfiguration = jwtConfiguration;
    }

    async canActivate(context: ExecutionContext): Promise<boolean>
    {
        const request = context.switchToHttp().getRequest<ExpressRequest>();

        const token = this.extractTokenFromHeaders(request)
        if (!token)
        {
            throw new UnauthorizedException(`${AccessTokenGuard.name}:${this.canActivate.name}:!token`);
        }

        try
        {
            const payload = await this.#jwtService.verifyAsync(token, this.#jwtConfiguration);
            request[REQUEST_USER_KEY] = payload;
        }
        catch(error)
        {
            throw new Error(`${AccessTokenGuard.name}:${this.canActivate.name}:(error)`);
        }

        return true;
    }

    private extractTokenFromHeaders(request: Request): string | undefined
    {
        const [ _, token ] = request.headers.authorization?.split(' ') ?? [];
        return token;
    }
}
