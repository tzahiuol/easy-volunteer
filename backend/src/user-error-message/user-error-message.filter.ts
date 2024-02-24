import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { UserErrorMessageException } from 'src/user-error-message/class';
import { Response } from 'express';

@Catch(UserErrorMessageException)
export class UserErrorMessageFilter implements ExceptionFilter {
  catch(exception: UserErrorMessageException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response
      .status(exception.statusCode)
      .json({
        message: exception.message
      });
  }
}
