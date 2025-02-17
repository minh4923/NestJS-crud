import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { PostRepository } from '../../post/repositories/post.repository';

@Injectable()
export class PostInfo implements CanActivate {
  constructor(private readonly postRepository: PostRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const postId = req.params.id;

    if (!req.user) {
      throw new UnauthorizedException('Please login!');
    }

    const post = await this.postRepository.getPostById(postId);
    if (!post) {
      throw new ForbiddenException('Post not found');
    }

    if (req.user.role === 'admin' || post.author.toString() === req.user.id) {
      return true; 
    }

    throw new ForbiddenException('Permision denied');
  }
}
