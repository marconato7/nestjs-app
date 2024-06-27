import { Controller, Get } from '@nestjs/common';
import { Tag } from './entities/tag.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { QueryBus } from '@nestjs/cqrs';
import { GetTagsQuery } from './queries/get-tags/get-tags.query';

@Controller()
export class TagsController
{  
    constructor(private readonly _queryBus: QueryBus) {}

    // Get Tags
    // GET /api/tags    
    // No authentication required
    // Returns a List of Tags
    @Auth(AuthType.None)
    @Get('tags')
    async getTags(): Promise<{ tags: string[] }>
    {
        const query = new GetTagsQuery();
        const tags = await this._queryBus.execute<GetTagsQuery, Promise<Tag[]>>(query);        
        const listOfTags = this.toListOfTags(tags);
        return listOfTags;
    }

    private toListOfTags(tags: Tag[]): { tags: string[] }
    {
        const listoFTags =
        {
            tags: tags.map(t => t.name)
        };

        return listoFTags;
    }
}
