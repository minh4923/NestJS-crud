import { CanActivate, ExecutionContext, Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../guards/auth.decorator';
import { PostRepository } from '../../post/repositories/post.repository';
import { User } from '../../user/schemas/user.schema'; 
import { InjectModel } from '@nestjs/mongoose'; 
import { Model } from 'mongoose'; 

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly postRepository: PostRepository,
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    const req = context.switchToHttp().getRequest();
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('You are not logged in yet!');
    }

    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new UnauthorizedException('User not found!');
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
