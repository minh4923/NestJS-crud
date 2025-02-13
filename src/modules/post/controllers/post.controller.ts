import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { PostService } from '../services/post.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { Post as Posts } from '../schemas/post.schema';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
import { OwnerOrAdminGuard } from 'src/modules/auth/guards/owner-or-admin.guard';
import { User, UserDocument } from 'src/modules/user/schemas/user.schema';
import { Request } from 'express';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request';
@Controller('posts')
export class PostControlelr {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createPost(
    @Body() data: CreatePostDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Posts> {
    const userId = req.user.id;
    return this.postService.createPost(data, userId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAllPost(): Promise<Posts[]> {
    return this.postService.getAllPost();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getPostById(@Param('id') id: string): Promise<Posts> {
    return this.postService.getPostById(id);
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard('jwt'))
  async getAllPostByUserId(@Param('userId') userId: string) {
    return this.postService.getAllPostByUserId(userId);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), OwnerOrAdminGuard)
  async updatePostById(
    @Param() id: string,
    @Body() data: UpdatePostDto,
  ): Promise<Posts> {
    return this.postService.updatePostById(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), OwnerOrAdminGuard)
  async deletePostById(@Param('id') id: string): Promise<{ message: string }> {
    return this.postService.deletePostById(id);
  }
}
