import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { HashingService } from './hashing.service';

@Injectable()
export class BcryptService implements HashingService
{
    async hash(data: string): Promise<string>
    {
        const hash = await bcrypt.hash(data, 12);
        return hash;
    }

    async compare(data: string, hash: string): Promise<boolean>
    {
        return await bcrypt.compare(data, hash);
    }
}
