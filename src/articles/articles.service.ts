import { Injectable } from '@nestjs/common';
import { CreateArticleRequest } from './dto/create-article.request';
import { UpdateArticleRequest } from './dto/update-article.request';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { DataSource, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ArticlesService
{
    constructor(private readonly _dataSource : DataSource) {}

    async create(userEmail: string, request: CreateArticleRequest): Promise<Article>
    {
        // const user: User = await this.#usersService.findByEmail(userEmail);

        const userRepository = this._dataSource.manager.getRepository(User);
        const articleRepository = this._dataSource.manager.getRepository(Article);
    
        const user: User | null = await userRepository.findOne({
            where: {
                email: userEmail,
            },
            relations: {
                articles: true,
            },
        });

        if (!user)
        {
            throw new Error();
        }

        const article = Article.create(request.article.title, request.article.description, request.article.body, request.article.tagList);
        
        await articleRepository.save(article);

        user.articles.push(article);

        await userRepository.save(user);
        
        return article;
    }

    findAll()
    {
        return this._dataSource.manager.find(Article, { relations: { author: true }});
    }

    async findOne(slug: string) : Promise<Article | null>
    {
        const article = await this._dataSource.manager.findOneBy(Article, { slug });
        return article;
    }

    async update(id: number, request: UpdateArticleRequest): Promise<Article | null>
    {
        const article = await this._dataSource.manager.preload(Article, { id, ...request });

        if (!article) {
            return null;
        }

        const updatedArticle = await this._dataSource.manager.save(Article, article);

        return updatedArticle;
    }

    async remove(slug: string): Promise<Article | null>
    {
        const article = await this.findOne(slug);
        if (article) {
            return this._dataSource.manager.remove(Article, article);
        }

        return null;
    }
}
