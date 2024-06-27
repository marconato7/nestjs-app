import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Article } from "src/articles/entities/article.entity";
import { UserResponse } from "../dto/user.response";
import { v7 as uuidv7 } from 'uuid';
import { CommentEntity } from "src/comments/entities/comment.entity";
import * as bcrypt from 'bcrypt';

/*
    Single Article
    {
        "article": {
            "slug": "how-to-train-your-dragon",
            "title": "How to train your dragon",
            "description": "Ever wonder how?",
            "body": "It takes a Jacobian",
            "tagList": ["dragons", "training"],
            "createdAt": "2016-02-18T03:22:56.637Z",
            "updatedAt": "2016-02-18T03:48:35.824Z",
            "favorited": false,
            "favoritesCount": 0,
            "author": {
                "username": "jake",
                "bio": "I work at statefarm",
                "image": "https://i.stack.imgur.com/xHWG8.jpg",
                "following": false
            }
        }
    }
*/
@Entity()
export class User
{
    @PrimaryColumn()
    id: string = uuidv7();

    @OneToMany(() => CommentEntity, comment => comment.author)
    public comments!: CommentEntity[];

    @ManyToMany(() => User)
    @JoinTable()
    connections!: User[]
    
    @OneToMany(() => Article, (article: Article) => article.author, { cascade: true })
    articles!: Article[];

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    bio?: string;

    @Column({ nullable: true })
    image?: string;

    // @Column()
    // private readonly token: string;

    // @Column()
    // private readonly password: string;

    private constructor(email: string, username: string, password: string, bio?: string, image?: string)
    {
        this.email = email;
        this.username = username;
        this.bio = bio;
        this.image = image;
        this.password = password;
    }

    public static create(email: string, username: string, password: string, bio?: string, image?: string)
    {
        password = bcrypt.hashSync(password, 12);
        return new this(email, username, password, bio, image);
    }

    public ToUserResponse(): UserResponse {
        const { email, username, bio, image } = this;

        return {
            user: {
                email,
                token: 'token',
                username,
                bio,
                image,
            }
        };
    }
}
