import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RegistrationRequest } from './dto/registration.request';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService
{    
    constructor(private readonly _dataSource : DataSource) {}

    async create(request: RegistrationRequest): Promise<User | null>
    {
        const { email, username, password, bio, image } = request.user;

        const existsByEmail = await this._dataSource.manager.existsBy(User, { email });
        if (existsByEmail)
        {
            return null;
        }

        const existsByUsername = await this._dataSource.manager.existsBy(User, { username });
        if (existsByEmail)
        {
            return null;
        }        

        const hash = await bcrypt.hash(password, 12);

        const user = User.create(email, username, hash, bio, image);        

        await this._dataSource.manager.save<User>(user);

        return user;
    }

    async findAll()
    {
        const users = await this._dataSource.manager.find(User, { relations: { articles: true }});
        return users;
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    async findByEmail(email: string): Promise<any | null>
    {
        try
        {            
            const user = await this._dataSource.manager.find(User,
            {
                    relations: {
                        articles: true,
                    },
                    where: {
                        email,
                    },
            });

            return user;
        }
        catch (error: any)
        {
            throw new InternalServerErrorException(error.message);
        }
    }

    // update(id: number, updateUserDto: UpdateUserDto) {
    //     return `This action updates a #${id} user`;
    // }

    // remove(id: number) {
    //     return `This action removes a #${id} user`;
    //     const user = User.create(request.email, request.username, request.password);
    //     await this._usersRepository.save(user);
    //     // example how to remove DM entity
    //     await userRepository.remove(user)
    // }
}
