import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { UserRepository } from './user.repository';
import { User, UserDocument, UserSchema } from '../schemas/user.schema';

describe('UserRepository (with Docker MongoDB)', () => {
  let repository: UserRepository;
  let model: Model<UserDocument>;
  let connection: Connection;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(process.env.MONGODB_URI as string),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [UserRepository],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    model = module.get<Model<UserDocument>>(getModelToken(User.name));
    connection = module.get<Connection>(getConnectionToken());
  });

  afterAll(async () => {
    // Cleanup sau khi test
    await model.deleteMany({}); // Xóa dữ liệu test
    await connection.close(); 
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const userDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword',
      };

      const result = await repository.createUser(userDto);

      expect(result).toMatchObject({
        name: 'Test User',
        email: 'test@example.com',
      });

      expect(result._id).toBeDefined();
    });

    it('should not allow duplicate emails', async () => {
      const userDto = {
        name: 'Test User',
        email: 'duplicate@example.com',
        password: 'hashedpassword',
      };

      await repository.createUser(userDto);

      await expect(repository.createUser(userDto)).rejects.toThrow();
    });
  });

  describe('getUserByEmail', () => {
    it('should return user when email exists', async () => {
      const userDto = {
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'hashedpassword',
      };

      await repository.createUser(userDto);
      const user = await repository.getUserByEmail(userDto.email);

      expect(user).toBeDefined();
      expect(user?.email).toBe(userDto.email);
    });

    it('should return null if user does not exist', async () => {
      const user = await repository.getUserByEmail('nonexistent@example.com');
      expect(user).toBeNull();
    });
  });

  describe('getUserById', () => {
    it('should return user by ID', async () => {
      const userDto = {
        name: 'User ID Test',
        email: 'userid@example.com',
        password: 'hashedpassword',
      };

      const createdUser = await repository.createUser(userDto);
      const user = await repository.getUserById(createdUser._id.toString());

      expect(user).toBeDefined();
      expect(user?._id.toString()).toBe(createdUser._id.toString());
    });
  });

  describe('updateUserById', () => {
    it('should update user successfully', async () => {
      const userDto = {
        name: 'User to Update',
        email: 'update@example.com',
        password: 'hashedpassword',
      };

      const createdUser = await repository.createUser(userDto);

      const updatedUser = await repository.updateUserById(
        createdUser._id.toString(),
        {
          name: 'Updated Name',
        },
      );

      expect(updatedUser).toBeDefined();
      expect(updatedUser?.name).toBe('Updated Name');
    });
  });

  describe('deleteUserById', () => {
    it('should delete user successfully', async () => {
      const userDto = {
        name: 'User to Delete',
        email: 'delete@example.com',
        password: 'hashedpassword',
      };

      const createdUser = await repository.createUser(userDto);

      const deleteResult = await repository.deleteUserById(
        createdUser._id.toString(),
      );
      expect(deleteResult).toBe(true);

      const userAfterDelete = await repository.getUserById(
        createdUser._id.toString(),
      );
      expect(userAfterDelete).toBeNull();
    });
  });
});
