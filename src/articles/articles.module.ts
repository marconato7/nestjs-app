import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({

    imports:
    [
        TypeOrmModule.forFeature([ Article ]),
        UsersModule,
    ],

    controllers:
    [
        ArticlesController
    ],

    providers:
    [
        ArticlesService,
        UsersService,
    ],

    exports:
    [
        ArticlesService,
    ],

})
export class ArticlesModule {}
