import { Injectable } from '@nestjs/common';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagsService
{
    constructor(@InjectRepository(Tag) private readonly _tagsRepository: Repository<Tag>) {}

    async findAll(): Promise<Tag[]>
    {
        const tags = await this._tagsRepository.find();
        return tags;
    }
}
