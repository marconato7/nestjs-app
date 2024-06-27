import { IsNotEmpty, IsString } from "class-validator"

export class FollowUserCommand
{
    @IsString()
    @IsNotEmpty()
    private readonly _followedEmail: string;

    @IsString()
    @IsNotEmpty()
    private readonly _followerUsername: string;

    constructor(followedEmail: string, followerUsername: string)
    {
        this._followedEmail = followedEmail;
        this._followerUsername = followerUsername;
    }

    public get followedEmail(): string
    {
        return this._followedEmail;
    }

    public get followerUsername(): string
    {
        return this._followerUsername;
    }
}