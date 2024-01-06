import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class UserLoginGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req: any = context.switchToHttp().getRequest();
    const session = req.session;
    if (session.user) {
      return true
    }
    return false;
  }
}