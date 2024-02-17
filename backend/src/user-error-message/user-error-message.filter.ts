import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { UserErrorMessage } from 'src/user-error-message/class';
import { Response } from 'express';

@Catch(UserErrorMessage)
export class UserErrorMessageFilter<UserErrorMessage> implements ExceptionFilter {
  catch(exception: UserErrorMessage, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response
      .status(400)
      .json({
        statusCode: 400,
        timestamp: new Date().toISOString(),
        message: exception.message
      });

  }
}
