import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Tag } from './tags/entities/tag.entity';
import { faker } from '@faker-js/faker';
import { User } from './users/entities/user.entity';
import { UsersService } from './users/users.service';
import { Article } from './articles/entities/article.entity';
import { ArticlesService } from './articles/articles.service';
import { CommentEntity } from './comments/entities/comment.entity';

@Injectable()
export class AppService
{
    constructor
    (
        @InjectDataSource() private readonly _dataSource: DataSource,
        private readonly _usersService: UsersService,
        private readonly _articlesService: ArticlesService,
    ) {}
    
    async seed()
    {        
        if (await this._dataSource.manager.count(User) === 0)
        {
            const user = this.createRandomUser();
            await this._dataSource.manager.save<User>(user);
        }
        // const article = (await this._dataSource.manager.find(Article, { select: { comments: true }, where: { slug: 'converse-across' }, relations: { comments: true }}))[0];
        // const user = (await this._dataSource.manager.find(User, { select: { id: true }, where: { email: 'abigail73@gmail.com' } }))[0];
        // const comment = this.createRandomComment();
        // article.comments.push(comment);
        // comment.user = user;
        // await this._dataSource.manager.save(article);
        // const articles: Article[] = faker.helpers.multiple(this.createRandomArticle, { count: 10 });
        // user.articles = articles;
     
        // const tags: Tag[] = faker.helpers.multiple(this.createRandomTag, { count: 1000 });
        // await this._dataSource.manager.save(tags);
        // const article = await this._dataSource.manager.findOneBy(Article, { slug });
       
        // const tags: Tag[] = faker.helpers.multiple(this.createRandomTag, { count: 10 });
        // const articles: Article[] = faker.helpers.multiple(this.createRandomArticle, { count: 20 });
        // const comments: Comment[] = faker.helpers.multiple(this.createRandomArticle, { count: 400 });
        // await this._dataSource.manager.save<Tag>(tags);
    }

    private createRandomUser() : User
    {
        const user: User = User.create
        (
            faker.internet.email().toLowerCase(),
            faker.internet.userName().toLowerCase(),
            faker.internet.password({ memorable: true }),
            faker.person.bio(),
            faker.image.url(),
        );

        return user;
    }

    // private createRandomUser() : Promise<User | null>
    // {
    //     const user = this._usersService.create({
    //         user: {
    //             username: faker.internet.userName(),
    //             email:faker.internet.email(),
    //             password: faker.internet.password(),
    //             bio: faker.person.bio(),
    //             image: faker.image.url(),
    //         },
    //     });

    //     return user;
    // }

    private async createUserWithArticles(numberOfArticles: number)
    {
        await this._dataSource.transaction(async (db) =>
        {
            const user = await this.createRandomUser();
            if (user)
            {
                for (let i = 0; i < numberOfArticles; i++)
                {
                    await this._articlesService.create(user.email, { article: { title: faker.word.words(), description: faker.word.words(), body: faker.lorem.text(), tagList: [] }});
                }
            }
            else
            {
                throw new Error();
            }
        });
    }

    private createRandomTag(): Tag
    {
        const tag = Tag.create(faker.word.noun());
        return tag;
    }

    private createRandomArticle(): Article
    {
        const title = faker.word.words();
        const description = faker.word.words();
        const body = faker.lorem.text();

        const article = Article.create
        (
            title,
            description,
            body,
            [],
        );

        return article;
    }

    private createRandomComment(): CommentEntity
    {
        const comment = new CommentEntity();
        comment.body = faker.word.words();
        return comment;
    }
}
