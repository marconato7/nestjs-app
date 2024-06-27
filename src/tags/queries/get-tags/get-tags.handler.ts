import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { GetTagsQuery } from "./get-tags.query";
import { Tag } from "src/tags/entities/tag.entity";

@QueryHandler(GetTagsQuery)
export class GetTagsHandler implements IQueryHandler<GetTagsQuery>
{
    constructor(@InjectDataSource() private readonly _dataSource: DataSource) {}

    async execute(): Promise<Tag[]>
    {
        const tags = await this._dataSource.manager.find(Tag);
        return tags;
    }
}
