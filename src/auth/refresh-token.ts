import { sign } from 'jsonwebtoken';

class RefreshToken
{
    id!: number;
    userId!: number;
    userAgent!: number;
    ipAddress!: string;

    constructor(init?: Partial<RefreshToken>)
    {
        Object.assign(this, init);
    }

    sign(): string
    {
        const refreshToken = sign({ ...this }, process.env.REFRESH_SECRET || 'abc' );
        return refreshToken;
    }
}

export default RefreshToken;
