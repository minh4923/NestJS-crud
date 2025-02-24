import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    if (!req.user) {
      throw new UnauthorizedException('You are not logged in yet');
    }

    if (req.user.role !== 'admin') {
      throw new ForbiddenException('You do not have access');
    }

    return true; 
  }
}
