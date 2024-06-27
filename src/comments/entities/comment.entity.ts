import { Article } from "src/articles/entities/article.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { v7 as uuidv7 } from 'uuid';

@Entity()
export class CommentEntity
{
    @PrimaryColumn()
    id: string = uuidv7();

    @CreateDateColumn({ type: 'timestamptz' })
    public createdAt!: Date

    @UpdateDateColumn({ type: 'timestamptz' })
    public updatedAt!: Date

    @Column()
    public body!: string;

    @Column()
    public articleId!: number

    @Column()
    public userId!: number

    @ManyToOne(() => Article, (article) => article.comments)
    public article!: Article

    @ManyToOne(() => User, (user) => user.comments)
    author!: User
}
