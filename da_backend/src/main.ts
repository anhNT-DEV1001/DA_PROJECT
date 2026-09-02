import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { CustomValidationPipe } from './common/pipes';
import { HttpExceptionFilter } from './common/filters';
import { TransformInterceptor } from './common/interceptors';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  const host = config.get<string>('HOST') ?? 'localhost';
  const port = config.get<number>('PORT') ?? 9000;
  const prefix = config.get<string>('GLOBAL_PREFIX') ?? 'api/v1';

  const reflector = app.get(Reflector);

  app.setGlobalPrefix(prefix);
  app.use(cookieParser());
  const allowedOrigins = config
    .get<string>('FRONTEND_URL', 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({ origin: allowedOrigins, credentials: true });
  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  await app.listen(port, host);
  console.log(`Server is running on http://${host}:${port}/${prefix}`);
}
void bootstrap();
