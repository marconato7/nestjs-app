import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FollowUserCommand } from "./follow-user.command";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { User } from "./entities/user.entity";

@QueryHandler(FollowUserCommand)
export class FollowUserHandler implements IQueryHandler<FollowUserCommand>
{
    constructor(@InjectDataSource() private readonly _dataSource: DataSource) {}

    async execute(command: FollowUserCommand): Promise<any>
    {        
        const followed = (await this._dataSource.manager.find(User, { where: { email: command.followedEmail }, relations: { connections: true } }))[0];
        const follower = (await this._dataSource.manager.find(User, { where: { username: command.followerUsername }, relations: { connections: true } }))[0];
        followed.connections.push(follower);
        await this._dataSource.manager.save(followed);
        throw NaN;
        // Profile
        // {
        //   "profile": {
        //     "username": "jake",
        //     "bio": "I work at statefarm",
        //     "image": "https://api.realworld.io/images/smiley-cyrus.jpg",
        //     "following": false
        //   }
        // }
    }
}
