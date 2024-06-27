import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetArticleQuery } from "./get-article.query";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { Article } from "../entities/article.entity";

@QueryHandler(GetArticleQuery)
export class GetArticleHandler implements IQueryHandler<GetArticleQuery, Article | null>
{
    constructor(@InjectDataSource() private readonly _dataSource: DataSource) {}

    async execute(query: GetArticleQuery): Promise<Article | null>
    {
        const { slug } = query;

        const articles = await this._dataSource.manager.find(Article,
        {
            where: { slug },
            relations: { author: true },
        });

        if (!articles.length) {
            return null;
        }

        const article = articles[0];

        return article;
    }
}
