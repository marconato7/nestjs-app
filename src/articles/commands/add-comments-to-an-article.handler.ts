import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { AddCommentsToAnArticleCommand } from "./add-comments-to-an-article.command";
import { DataSource } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { Article } from "../entities/article.entity";
import { User } from "src/users/entities/user.entity";
import { CommentEntity } from "src/comments/entities/comment.entity";

@QueryHandler(AddCommentsToAnArticleCommand)
export class AddCommentsToAnArticleCommandHandler implements IQueryHandler<AddCommentsToAnArticleCommand>
{
    constructor(@InjectDataSource() private readonly _dataSource: DataSource) {}

    async execute(command: AddCommentsToAnArticleCommand): Promise<any>
    {
        const { body, email, slug } = command;

        const article = (await this._dataSource.manager.find(Article, { where: { slug }, relations: { comments: true } }))[0];

        const user = (await this._dataSource.manager.find(User, { where: { email } }))[0];
        
        const comment = new CommentEntity();
        comment.body = body;
        comment.article = article;
        comment.author = user;

        await this._dataSource.manager.save(comment);

        article.comments.push(comment);

        await this._dataSource.manager.save(article);
    }
}
