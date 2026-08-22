import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = new ConfigService();

  const host = config.get<string>('HOST') ?? 'localhost';
  const port = config.get<number>('PORT') ?? 9000;
  const prefix = config.get<string>('GLOBAL_PREFIX') ?? 'api/v1';

  app.setGlobalPrefix(prefix);
  app.use(cookieParser());
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  await app.listen(port, host);
  console.log(`Server is running on http://${host}:${port}/${prefix}`);
}
bootstrap();
