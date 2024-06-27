import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';

async function bootstrap()
{
    const app = await NestFactory.create(AppModule);    

    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
    }));

    app.setGlobalPrefix('api');

    const appService = app.get(AppService);
    await appService.seed();

    await app.listen(3000);
}

bootstrap();
