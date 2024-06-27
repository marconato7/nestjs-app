import { Type } from "class-transformer";
import { IsString, ValidateNested } from "class-validator";
class ArticleResponseProps
{
    @IsString()
    readonly slug: string;

    @IsString()
    readonly title: string;

    @IsString()
    readonly description: string;

    @IsString()
    readonly body: string;

    @IsString({ each: true })
    readonly tagList?: string[];

    // favorited
    // favoritesCount
    // author: username, bio, image, following

    constructor(slug: string, title: string, description: string, body: string, tagList?: string[])
    {
        this.slug = slug;
        this.title = title;
        this.description = description;
        this.body = body;
        this.tagList = tagList;
    }
};

export class ArticleResponse
{
    @ValidateNested()
    @Type(() => ArticleResponseProps)
    article: ArticleResponseProps;

    constructor(slug: string, title: string, description: string, body: string, tagList?: string[])
    {
        const articleResponseProps = new ArticleResponseProps(slug, title, description, body, tagList);
        this.article = articleResponseProps;
    }
}
