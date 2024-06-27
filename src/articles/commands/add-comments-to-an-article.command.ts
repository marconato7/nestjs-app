import { IsNotEmpty, IsString } from "class-validator"

export class AddCommentsToAnArticleCommand
{
    @IsString()
    @IsNotEmpty()
    private readonly _slug: string;

    @IsString()
    @IsNotEmpty()
    private readonly _body: string;

    @IsString()
    @IsNotEmpty()
    private readonly _email: string;

    constructor(slug: string, body: string, email: string)
    {
        this._slug = slug;
        this._body = body;
        this._email = email;
    }

    public get slug(): string
    {
        return this._slug;
    }

    public get body(): string
    {
        return this._body;
    }

    public get email(): string
    {
        return this._email;
    }
}
