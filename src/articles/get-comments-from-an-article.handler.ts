import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetCommentsFromAnArticleQuery } from "./get-comments-from-an-article.query";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { Article } from "./entities/article.entity";

@QueryHandler(GetCommentsFromAnArticleQuery)
export class GetCommentsFromAnArticleHandler implements IQueryHandler<GetCommentsFromAnArticleQuery>
{
    constructor(@InjectDataSource() private readonly _dataSource: DataSource) {}

    async execute(query: GetCommentsFromAnArticleQuery): Promise<any>
    {
        const { slug } = query;

        const article = (await this._dataSource.manager.find(Article, { where: { slug }, relations: { comments: true, author: true, }}))[0];

        if (!article)
        {
            return null;
        }

        const comments = article.comments;

        return comments;
    }
}
