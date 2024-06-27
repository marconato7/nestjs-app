import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";

export class UserResponseProps
{
    readonly email!: string;
    readonly token!: string;
    readonly username!: string;
    readonly bio?: string;
    readonly image?: string;
};

export class UserResponse
{
    @ValidateNested()
    @Type(() => UserResponseProps)
    readonly user!: UserResponseProps;
}
