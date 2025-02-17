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
  Query,
} from '@nestjs/common';
import { PostService } from '../services/post.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { Post as Posts } from '../schemas/post.schema';
import { PostInfo } from '../../auth/guards/postInfo.guard';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request';
@Controller('posts')
export class PostControler {
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
  async getAllPost(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.postService.getAllPost(page, limit);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getPostById(@Param('id') id: string): Promise<Posts> {
    return this.postService.getPostById(id);
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard('jwt'))
  async getAllPostByUserId(
    @Param('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.postService.getAllPostByUserId(userId, page, limit);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), PostInfo)
  async updatePostById(
    @Param() id: string,
    @Body() data: UpdatePostDto,
  ): Promise<Posts> {
    return this.postService.updatePostById(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), PostInfo)
  async deletePostById(@Param('id') id: string): Promise<{ message: string }> {
    return this.postService.deletePostById(id);
  }
}
