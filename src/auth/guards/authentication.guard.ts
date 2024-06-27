import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthType } from "../enums/auth-type.enum";
import { Reflector } from "@nestjs/core";
import { AUTH_TYPE_KEY } from "../decorators/auth.decorator";
import { AccessTokenGuard } from "./access-token.guard";
import { REQUEST_USER_KEY } from "../auth.constants";

@Injectable()
export class AuthenticationGuard implements CanActivate
{
    private static readonly defaultAuthType = AuthType.Bearer;

    private readonly authTypeGuardMap: Record<AuthType, CanActivate | CanActivate[]> =
    {
        [AuthType.Bearer]: this._accessTokenGuard,
        [AuthType.Cookie]: this._accessTokenGuard,
        [AuthType.None]: { canActivate: () => true },
    };

    constructor( private readonly _reflector: Reflector, private readonly _accessTokenGuard: AccessTokenGuard,) {}

    async canActivate(context: ExecutionContext): Promise<boolean>
    {
        const authTypes = this._reflector.getAllAndOverride<AuthType[]>(
            AUTH_TYPE_KEY,
            [ context.getHandler(), context.getClass() ]
        ) ?? [ AuthenticationGuard.defaultAuthType ];

        const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();

        let error = new UnauthorizedException();

        for (const instance of guards)
        {
            const canActivate = await Promise.resolve(instance.canActivate(context)).catch((err) => { error = err; });
            if (canActivate) return true;
        }

        throw error;
    }
}
