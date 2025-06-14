import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const configService = app.get(ConfigService);
  const port: number = configService.get<number>('PORT') ?? 3003;
  await app.listen(port);
  console.log(`Server is running on port:${port}`);
}
bootstrap();
