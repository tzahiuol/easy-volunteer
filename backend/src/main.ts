import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import { UserErrorMessageFilter } from './user-error-message/user-error-message.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const FileStore = require('session-file-store')(session);



async function bootstrap() {
  const temp_session_path = "/tmp/sessions"
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api/')
  app.useGlobalFilters(new UserErrorMessageFilter());
  app.useGlobalPipes(new ValidationPipe());
  
  const config = new DocumentBuilder()
    .setTitle('EasyVolunteer')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(
    session({
      secret: 'randomsercret',
      store: new FileStore({ path: temp_session_path }),
      resave: false,
      saveUninitialized: false,
    }),
  );
  await app.listen(3000);
}
bootstrap();
