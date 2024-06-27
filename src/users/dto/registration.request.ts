import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsUrl, ValidateNested } from "class-validator";

export class RegistrationRequestProps
{
    @IsNotEmpty()
    readonly username!: string;

    @IsNotEmpty()
    readonly email!: string;

    @IsNotEmpty()
    readonly password!: string;

    @IsString()
    @IsOptional()
    readonly bio?: string;

    @IsString()
    @IsUrl()
    @IsOptional()
    readonly image?: string;
};

export class RegistrationRequest
{
    @ValidateNested()
    @Type(() => RegistrationRequestProps)
    readonly user!: RegistrationRequestProps;
}
