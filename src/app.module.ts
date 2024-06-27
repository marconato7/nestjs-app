import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ArticlesModule } from './articles/articles.module';
import { InjectDataSource, TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from './users/middlewares/auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { TagsModule } from './tags/tags.module';
import { CommentsModule } from './comments/comments.module';
import jwtConfig from './auth/jwt.config';
import { DataSource } from 'typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { GetArticleHandler } from './articles/queries/get-article.handler';
import { FollowUserHandler } from './users/follow-user.handler';
import { AddCommentsToAnArticleCommandHandler } from './articles/commands/add-comments-to-an-article.handler';
import { AppService } from './app.service';
import { GetTagsHandler } from './tags/queries/get-tags/get-tags.handler';
import { ArticlesService } from './articles/articles.service';
import { UsersService } from './users/users.service';
import { GetCommentsFromAnArticleHandler } from './articles/get-comments-from-an-article.handler';

@Module({

    imports:
    [
        ConfigModule.forRoot(),
        ConfigModule.forFeature(jwtConfig),
        CqrsModule.forRoot(),        
        TypeOrmModule.forRoot
        ({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'pass123',
            database: 'postgres',
            autoLoadEntities: true,
            synchronize: true,
            entities: [ __dirname + '/**/*.entity{.ts,.js}' ],
            logging: true,
        }),
        ArticlesModule,
        TagsModule,
        UsersModule,
        AuthModule,
        // JwtModule.register
        // ({
        //     global: true,
        //     secret: '123456123456123456123456123456123456123456123456123456123456',
        //     signOptions: { expiresIn: '60s' },
        // }),
        JwtModule.registerAsync(jwtConfig.asProvider()),
        CommentsModule,
    ],
    
    controllers:
    [
    ],
    
    providers:
    [
        AppService,
        ArticlesService,
        UsersService,

        GetArticleHandler,
        FollowUserHandler,
        AddCommentsToAnArticleCommandHandler,
        GetTagsHandler,
        GetCommentsFromAnArticleHandler,
    ],
})
export class AppModule {}
