import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { PostRepository } from '../../post/repositories/post.repository';

@Injectable()
export class OwnerOrAdminGuard implements CanActivate {
  constructor(private readonly postRepository: PostRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const postId = req.params.id;

    if (!req.user) {
      throw new UnauthorizedException('Bạn chưa đăng nhập');
    }

    const post = await this.postRepository.getPostById(postId);
    if (!post) {
      throw new ForbiddenException('Bài viết không tồn tại');
    }

    if (req.user.role === 'admin' || post.author.toString() === req.user.id) {
      return true; // ✅ Nếu là admin hoặc chủ bài viết, cho phép truy cập
    }

    throw new ForbiddenException('Bạn không có quyền thực hiện hành động này');
  }
}
