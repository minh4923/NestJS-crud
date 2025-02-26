import { CanActivate, ExecutionContext, Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './auth.decorator';
import { PostRepository } from '../../post/repositories/post.repository';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly postRepository: PostRepository
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException('You are not logged in yet!');
    }

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    if (requiredRoles.includes(user.role)) {
      return true;
    }

    if (requiredRoles.includes('owner')) {
      const resourceId = req.params.id;

      if (req.route.path.includes('users')) {
        if (resourceId === user.id) {
          return true;
        }
      }

      if (req.route.path.includes('posts')) {
        const post = await this.postRepository.getPostById(resourceId);
        if (!post) {
          throw new ForbiddenException('The post does not exist!');
        }
        if (post.author.toString() === user.id) {
          return true;
        }
      }
    }

    throw new ForbiddenException('You do not have permission to perform this action!');
  }
}
