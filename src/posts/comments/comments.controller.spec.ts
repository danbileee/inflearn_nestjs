import { Test, TestingModule } from '@nestjs/testing';
import { PostCommentsController } from './comments.controller';
import { PostCommentsService } from './comments.service';

describe('PostCommentsController', () => {
  let controller: PostCommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostCommentsController],
      providers: [PostCommentsService],
    }).compile();

    controller = module.get<PostCommentsController>(PostCommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
