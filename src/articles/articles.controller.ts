import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, UseGuards, NotFoundException } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleRequest } from './dto/create-article.request';
import { UpdateArticleRequest } from './dto/update-article.request';
import { Article, SingleArticle } from './entities/article.entity';
import { ArticleResponse } from './dto/article.response';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { QueryBus } from '@nestjs/cqrs';
import { GetArticleQuery } from './queries/get-article.query';
import { AddCommentsToAnArticleCommand } from './commands/add-comments-to-an-article.command';
import { GetCommentsFromAnArticleQuery } from './get-comments-from-an-article.query';
import { CommentEntity } from 'src/comments/entities/comment.entity';

@Controller()
export class ArticlesController
{

    constructor(private readonly _articlesService: ArticlesService, private readonly _queryBus: QueryBus) {}

    // Example request body:    
    // {
    //   "comment": {
        // "body": "His name was my name too."
    //   }
    // }    
    // Required field: body
    @Auth(AuthType.Bearer)
    @Post('articles/:slug/comments')
    // async addCommentsToAnArticle(@Param('slug') slug: string, @Body() body: any): Promise<Comment>
    async addCommentsToAnArticle(@Param('slug') slug: string, @Body() body: any, @ActiveUser('email') email: string): Promise<any>
    {
        const query = new AddCommentsToAnArticleCommand(slug, body.comment.body, email);
        await this._queryBus.execute(query);
    }

    // Will return single article
    @Auth(AuthType.None)
    @Get('articles/:slug')
    async getArticle(@Param('slug') slug: string): Promise<SingleArticle>
    {
        const query = new GetArticleQuery(slug);

        const articleOrNull = await this._queryBus.execute<GetArticleQuery, Promise<Article | null>>(query);
        if (!articleOrNull) {
            throw new NotFoundException();
        }

        return {
            article: {
                slug: articleOrNull.slug,
                title: articleOrNull.title,
                description: articleOrNull.description,
                body: articleOrNull.body,
                tagList: articleOrNull.tagList,
                createdAt: articleOrNull.createdAt.toLocaleString('pt-BR', { timeZone: 'Brazil/East' }),
                updatedAt: articleOrNull.updatedAt.toLocaleString('pt-BR', { timeZone: 'Brazil/East' }),
            }
        };
    }

    // Create Article
    // POST /api/articles
    // Example request body:
    // {
    //     "article": {
    //         "title": "How to train your dragon",
    //         "description": "Ever wonder how?",
    //         "body": "You have to believe",
    //         "tagList": ["reactjs", "angularjs", "dragons"]
    //     }
    // }
    // Authentication required, will return an Article
    // Required fields: title, description, body
    // Optional fields: tagList as an array of Strings
    @Post('articles')
    async createArticle(@ActiveUser('email') userEmail: string, @Body() request: CreateArticleRequest): Promise<ArticleResponse>
    {
        // map to internal representation

        // invoke use case
        const article = await this._articlesService.create(userEmail, request);

        // map to external representation
        const articleResponse = article.ToArticleResponse();
        return articleResponse;
    }

    @Get()
    listArticles(@Query() pagination: any)
    {
        const { limit, offset } = pagination;
        const articles = this._articlesService.findAll();
        const article = Article.create("Title", "Description", "Body");
        return { article };
        return { limit, offset, articles };
    }

    // @Get('feed')
    // feedArticles()
    // {
    // }

    // @Get(':slug')
    // getArticle(@Param('slug') id: string)
    // {
    // }

    // @Patch(':id')
    // update(
    //     @Param('id') id: string,
    //     @Body() updateArticleRequest: UpdateArticleRequest,
    // )
    // {
    // }

    // @Put(':id')
    // updateArticle(@Param('id') id: string, @Body() updateArticleRequest: UpdateArticleRequest)
    // {
    // }

    // @Delete(':slug')
    // deleteArticle(@Param('slug') slug: string)
    // {
    // }

    @Auth(AuthType.None)
    @Get('get-all-articles')
    async getAllArticles()
    {        
        return await this._articlesService.findAll();
    }

    // Get Comments from an Article
    // GET /api/articles/:slug/comments    
    // Authentication optional
    // Returns multiple comments
    @Auth(AuthType.None)
    @Get('articles/:slug/comments')
    async getCommentsFromAnArticle(@Param('slug') slug: string, @ActiveUser('email') email: string)
    {
        const query = new GetCommentsFromAnArticleQuery(slug);

        const comments: CommentEntity[] = await this._queryBus.execute(query);

        if (!comments)
        {
            return {};
        }            
        
        const mappedComments = comments.map((comment) => 
        {   
            return {
                id: comment.id,
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt,
                body: comment.body,
                author: {
                    username: comment.author.username,
                    bio: comment.author.bio,
                    imagem: comment.author.image,
                    following: false,
                },
            };
        });

        return { comments: mappedComments, };
    }
}
