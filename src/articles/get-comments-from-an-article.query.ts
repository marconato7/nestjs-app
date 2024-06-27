import { IsNotEmpty, IsString } from "class-validator"

export class GetCommentsFromAnArticleQuery
{
    @IsString()
    @IsNotEmpty()
    private readonly _slug: string;

    constructor(slug: string)
    {
        this._slug = slug;
    }

    public get slug(): string
    {
        return this._slug;
    }
}
