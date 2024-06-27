import { IsEmail, IsNotEmpty } from "class-validator";

export class AuthenticationRequest
{
    @IsNotEmpty()
    @IsEmail()
    readonly email!: string;

    @IsNotEmpty()
    readonly password!: string;
}
