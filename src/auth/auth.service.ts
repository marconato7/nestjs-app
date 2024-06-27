import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { HashingService } from './hashing.service';
import jwtConfig from './jwt.config';
import { ConfigType } from '@nestjs/config';
import { ActiveUserData } from './interfaces/active-user-data.interface';
import { RefreshTokenIdsStorage } from './refresh-token-ids.storage';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService
{
    constructor
    (
        @InjectRepository(User) private readonly _usersRepository: Repository<User>,
        private readonly _hashingService: HashingService,
        private readonly _jwtService: JwtService,
        @Inject(jwtConfig.KEY) private readonly _jwtConfiguration: ConfigType<typeof jwtConfig>,
        private readonly _refreshTokenIdsStorage: RefreshTokenIdsStorage,
    ) {}

    async signIn(request: any): Promise<any>
    {
        const { email, password } = request.user;

        const user = await this._usersRepository.findOneBy({ email });
        if (!user)
        {
            throw new Error(`${AuthService.name}:${this.signIn.name}:!user`);
        }

        const isPasswordCorrect = await this._hashingService.compare(password, user.password);
        if (!isPasswordCorrect)
        {
            throw new Error(`${AuthService.name}:${this.signIn.name}:!isPasswordCorrect`);
        }

        return await this.generateTokens(user);
    }

    async generateTokens(user: User)
    {
        const refreshTokenId = randomUUID();

        const [accessToken, refreshToken] = await Promise.all([
            this.signToken<Partial<ActiveUserData>>(user.id, this._jwtConfiguration.accessTokenTtl, { email: user.email }),
            this.signToken(user.id, this._jwtConfiguration.refreshTokenTtl), { refresh_token_id: refreshTokenId },
        ]);

        await this._refreshTokenIdsStorage.insert(user.id, refreshTokenId);

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }

    private async signToken<T>(userId: any, expiresIn: number, payload?: T)
    {
        return await this._jwtService.signAsync(
            {
                sub: userId,
                ...payload,
            },
            {
                audience: this._jwtConfiguration.audience,
                issuer: this._jwtConfiguration.issuer,
                secret: this._jwtConfiguration.secret,
                expiresIn,
            }
        );
    }

    async refreshTokens(refreshTokenDto: any)
    {
        try
        {
            const { sub, refresh_token_id } = await this._jwtService.verifyAsync<Pick<ActiveUserData, 'sub'> & { refresh_token_id: string }>(
                refreshTokenDto,
                {
                    secret: this._jwtConfiguration.secret,
                    audience: this._jwtConfiguration.audience,
                    issuer: this._jwtConfiguration.issuer,
                },
            );
    
            const user = await this._usersRepository.findOneByOrFail({ id: sub });

            const isValid = await this._refreshTokenIdsStorage.validate(user.id, refresh_token_id);

            if (isValid) {
                await this._refreshTokenIdsStorage.invalidate(user.id);
            } else {
                throw new Error('refresh token is invalid');
            }
    
            return await this.generateTokens(user);
        }
        catch (error)
        {
            throw new Error('2');
        }
    }

    async signUp(request: any): Promise<any> 
    {
        try
        {
            const { email, username, bio, image } = request;
            const password = await this._hashingService.hash(request.password);
            const user = User.create(email, username, password, bio, image);
            await this._usersRepository.save(user);
        }
        catch(error: any)
        {
            const pgUniqueViolationErrorCode = '23505';

            if (error.code === pgUniqueViolationErrorCode) {
                throw new Error(error.message);
            }

            throw new Error(error.message);
        }
    }
}
