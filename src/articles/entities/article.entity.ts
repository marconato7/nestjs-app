import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ArticleResponse } from "../dto/article.response";
import { Tag } from "src/tags/entities/tag.entity";
import { CommentEntity } from "src/comments/entities/comment.entity";
import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { faker } from '@faker-js/faker';

// Single Article
//  {
//      "article": {
//          "slug": "how-to-train-your-dragon",
//          "title": "How to train your dragon",
//          "description": "Ever wonder how?",
//          "body": "It takes a Jacobian",
//          "tagList": ["dragons", "training"],
//          "createdAt": "2016-02-18T03:22:56.637Z",
//          "updatedAt": "2016-02-18T03:48:35.824Z",
//          "favorited": false,
//          "favoritesCount": 0,
//          "author": {
//              "username": "jake",
//              "bio": "I work at statefarm",
//              "image": "https://i.stack.imgur.com/xHWG8.jpg",
//              "following": false
//          }
//      }
// }
export class SingleArticleProps
{
    readonly createdAt?: string

    readonly updatedAt?: string

    @IsNotEmpty()
    readonly slug!: string;

    @IsNotEmpty()
    readonly title!: string;

    @IsNotEmpty()
    readonly description!: string;

    @IsNotEmpty()
    readonly body!: string;

    @IsNotEmpty()
    readonly tagList?: string[];
};

export class SingleArticle
{
    @ValidateNested()
    @Type(() => SingleArticleProps)
    readonly article!: SingleArticleProps;
}

@Entity()
export class Article
{
    @OneToMany(() => CommentEntity, comment => comment.article, { cascade: true })
    public comments!: CommentEntity[];

    @CreateDateColumn({ type: 'timestamptz' })
    readonly createdAt!: Date

    @UpdateDateColumn({ type: 'timestamptz' })
    readonly updatedAt!: Date

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    slug: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    body: string;

    @Column('json', { nullable: true })
    tagList?: string[];

    @ManyToOne(() => User, (user: User) => user.articles)
    author!: User

    @ManyToMany(() => Tag)
    @JoinTable()
    tags!: Tag[]

    // private favorited: boolean;

    // private favoritesCount: number;

    // private authorr?:
    // {
    //     readonly username: string;
    //     readonly bio: string;
    //     readonly image: string;
    //     readonly following: boolean;
    // }

    private constructor
    (        
        title: string,
        description: string,
        body: string,
        tagList?: string[],
        // favorited?: boolean,
        // favoritesCount?: number,
    )
    {
        this.slug = faker.helpers.slugify(title),
        this.title = title;
        this.description = description;
        this.body = body;
        this.tagList = tagList;
        // this.favorited = favorited;
        // this.favoritesCount = favoritesCount;     
    }

    public static create
    (
        title: string,
        description: string,
        body: string,
        tagList?: string[],
    )
    {
        return new this
        (
            title,
            description,
            body,
            tagList,
        );
    }

    public ToArticleResponse(): ArticleResponse
    {        
        const articleResponse = new ArticleResponse(this.slug, this.title, this.description, this.body, this.tagList);
        return articleResponse;
    }
}
