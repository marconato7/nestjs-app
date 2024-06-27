import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleRequest } from './create-article.request';

export class UpdateArticleRequest extends PartialType(CreateArticleRequest) {}
