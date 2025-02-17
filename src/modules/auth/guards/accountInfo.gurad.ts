import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { PostRepository } from '../../post/repositories/post.repository';

@Injectable()
export class AccountInfo implements CanActivate {
  constructor(private readonly postRepository: PostRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userId = req.params.id;

    if (!req.user) {
      throw new UnauthorizedException('Please login!');
    }

    if (req.user.role === 'admin' || userId === req.user.id) {
      return true; 
    }

    throw new ForbiddenException('Bạn không có quyền thực hiện hành động này');
  }
}
