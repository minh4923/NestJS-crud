import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards, Req, Query } from '@nestjs/common';
import { PostService } from '../services/post.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { Post as Posts } from '../schemas/post.schema';
import { PostInfo } from '../../auth/guards/postInfo.guard';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Posts')
@ApiBearerAuth()
@Controller('posts')
export class PostControler {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new post' })
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({ status: 201, description: 'The post has been created' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async createPost(@Body() data: CreatePostDto, @Req() req: AuthenticatedRequest): Promise<Posts> {
    const userId = req.user.id;
    return this.postService.createPost(data, userId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Retrieve a list of all posts' })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: 'Number of posts per page',
  })
  @ApiResponse({
    status: 200,
    description: 'The list of posts has been returned',
  })
  async getAllPost(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.postService.getAllPost(page, limit);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Retrieve a post by ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the post' })
  @ApiResponse({ status: 200, description: 'The post has been returned' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async getPostById(@Param('id') id: string): Promise<Posts> {
    return this.postService.getPostById(id);
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Retrieve all posts of a specific user' })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'ID of the user',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: 'Number of posts per page',
  })
  @ApiResponse({
    status: 200,
    description: 'The list of user posts has been returned',
  })
  async getAllPostByUserId(@Param('userId') userId: string, @Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.postService.getAllPostByUserId(userId, page, limit);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), PostInfo)
  @ApiOperation({ summary: 'Update a post by ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the post' })
  @ApiBody({ type: UpdatePostDto })
  @ApiResponse({ status: 200, description: 'The post has been updated' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({
    status: 403,
    description: 'No permission to update this post',
  })
  async updatePostById(@Param('id') id: string, @Body() data: UpdatePostDto): Promise<Posts> {
    return this.postService.updatePostById(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), PostInfo)
  @ApiOperation({ summary: 'Delete a post by ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the post' })
  @ApiResponse({ status: 200, description: 'The post has been deleted' })
  @ApiResponse({
    status: 403,
    description: 'No permission to delete this post',
  })
  async deletePostById(@Param('id') id: string): Promise<{ message: string }> {
    return this.postService.deletePostById(id);
  }
}
