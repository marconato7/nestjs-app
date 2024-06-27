import { Type } from "class-transformer";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";

class CreateArticleRequestProps
{
        @IsString()
        @IsNotEmpty()
        readonly title: string;
    
        @IsString()
        @IsNotEmpty()
        readonly description: string;
    
        @IsString()
        @IsNotEmpty()
        readonly body: string;
    
        @IsString({ each: true })
        @IsNotEmpty()
        readonly tagList?: string[];

        constructor(title: string, description: string, body: string, tagList?: string[])
        {
            this.title = title;
            this.description = description;
            this.body = body;
            this.tagList = tagList;
        }
};

export class CreateArticleRequest
{
    @ValidateNested()
    @Type(() => CreateArticleRequestProps)
    article: CreateArticleRequestProps;

    constructor(props: CreateArticleRequestProps)
    {
        this.article = props;
    }
}
