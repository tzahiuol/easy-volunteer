import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import { UserErrorMessageFilter } from './user-error-message/user-error-message.filter';

const FileStore = require('session-file-store')(session);



async function bootstrap() {
  const temp_session_path = "/tmp/sessions"
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: 'randomsercret',
      store: new FileStore({ path: temp_session_path }),
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.useGlobalFilters(new UserErrorMessageFilter());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
