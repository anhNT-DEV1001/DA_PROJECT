import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { CustomValidationPipe } from './common/pipes';
import { HttpExceptionFilter } from './common/filters';
import { TransformInterceptor } from './common/interceptors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  const swaggerConfig = new DocumentBuilder()
    .setTitle('DA API')
    .setDescription(
      'Tài liệu API sử dụng AccessToken & RefreshToken qua Cookies',
    )
    .setVersion('1.0')
    .addCookieAuth(
      'accessToken',
      {
        type: 'apiKey',
        in: 'cookie',
        description: 'JWT Access Token được lưu trong HttpOnly Cookie',
      },
      'access-token-cookie',
    )
    .addCookieAuth(
      'refreshToken',
      {
        type: 'apiKey',
        in: 'cookie',
        description: 'JWT Refresh Token dùng để cấp lại Access Token',
      },
      'refresh-token-cookie',
    )
    .addSecurityRequirements('access-token-cookie')
    .build();

  // 2. Tạo tài liệu OpenAPI Document
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      withCredentials: true,
    },
  });

  app.enableCors({ origin: allowedOrigins, credentials: true });
  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  await app.listen(port, host);
  console.log(`Server is running on http://${host}:${port}/${prefix}`);
}
void bootstrap();
