import { Injectable, OnApplicationBootstrap, OnApplicationShutdown } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RefreshTokenIdsStorage implements OnApplicationBootstrap, OnApplicationShutdown
{
    private _redisClient;

    onApplicationBootstrap()
    {
        this._redisClient = new Redis({
            host: 'localhost',
            port: 6379,
        });
    }

    onApplicationShutdown(signal?: string | undefined)
    {
        return this._redisClient.quit();
    }

    async invalidate(userId: any): Promise<void>
    {
        await this._redisClient.del(this.getKey(userId));
    }

    async validate(userId: any, tokenId: string): Promise<boolean>
    {
        const storeId = await this._redisClient.get(this.getKey(userId));
        if (storeId !== tokenId)
        {
            throw new Error('1');
        }

        return storeId === tokenId;
    }

    async insert(userId: any, tokenId: string): Promise<void>
    {
        await this._redisClient.set(this.getKey(userId), tokenId);
    }

    private getKey(userId: number): string
    {
        return `user-${userId}`;
    }
}
