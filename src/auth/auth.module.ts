import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HashingService } from './hashing.service';
import { BcryptService } from './bcrypt.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './jwt.config';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationGuard } from './guards/authentication.guard';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenIdsStorage } from './refresh-token-ids.storage';

@Module({

    imports:
    [
        TypeOrmModule.forFeature([ User, ]),
        JwtModule.registerAsync(jwtConfig.asProvider()),        
        ConfigModule.forFeature(jwtConfig),
        // ConfigModule.forRoot(),
        // forwardRef(() => UsersModule),
    ],

    controllers: [],

    providers:
    [
        {
            provide: HashingService,
            useClass: BcryptService,
        },
        {
            provide: APP_GUARD,
            useClass: AuthenticationGuard,
        },
        AccessTokenGuard,
        RefreshTokenIdsStorage,
        AuthService,
    ],

    exports:
    [
        AuthService,
    ],

})
export class AuthModule {}
