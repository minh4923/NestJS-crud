// setup.ts
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';

// Import các schema & repository/module khác nhau
import { User, UserSchema, UserDocument } from '../src/modules/user/schemas/user.schema';
import { Post, PostSchema, PostDocument } from '../src/modules/post/schemas/post.schema';
import { AuthService } from '../src/modules/auth/services/auth.service';
import { PostService } from '../src/modules/post/services/post.service';
import { UserService } from '../src/modules/user/services/user.service';
import { UserRepository } from '../src/modules/user/repositories/user.repository';
import { PostRepository } from '../src/modules/post/repositories/post.repository';

export async function createTestingModule(providers: any[] = []) {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      MongooseModule.forRoot(process.env.MONGODB_URI as string),
      MongooseModule.forFeature([
        { name: User.name, schema: UserSchema },
        { name: Post.name, schema: PostSchema },
      ]),
    ],
    providers: [...providers],
  }).compile();

  const userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
  const postModel = module.get<Model<PostDocument>>(getModelToken(Post.name));
  const connection = module.get<Connection>(getConnectionToken());

  return { module, userModel, postModel, connection };
}

export async function cleanDatabase(
  userModel?: Model<UserDocument>,
  postModel?: Model<PostDocument>,
) {
  if (userModel) await userModel.deleteMany({});
  if (postModel) await postModel.deleteMany({});
}

export async function closeConnection(connection: Connection) {
  await connection.close();
  console.log('MongoDB connection closed');
}
