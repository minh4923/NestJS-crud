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
      throw new UnauthorizedException('Bạn chưa đăng nhập');
    }

    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Bạn không có quyền truy cập');
    }

    return true; 
  }
}
