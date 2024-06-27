import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { HashingService } from 'src/auth/hashing.service';
import { BcryptService } from 'src/auth/bcrypt.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/auth/jwt.config';

@Module({

    imports:
    [
        TypeOrmModule.forFeature([ User, ]),
        AuthModule,
        // forwardRef(() => AuthModule),
        // ConfigModule.forRoot(),
        // ConfigModule.forFeature(jwtConfig),
        // JwtModule.registerAsync(jwtConfig.asProvider()),
    ],

    controllers:
    [
        UsersController,
    ],

    providers:
    [
        UsersService,
    ],

    exports:
    [
        UsersService,
    ],

})
export class UsersModule {}
