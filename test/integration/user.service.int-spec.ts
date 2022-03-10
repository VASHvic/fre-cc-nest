import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { UserService } from '../../src/user/user.service';

describe('user Service Integration Test', () => {
  let prisma: PrismaService;
  let userService: UserService;
  let userId: number;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    prisma = moduleRef.get(PrismaService);
    userService = moduleRef.get(UserService);
    await prisma.cleanDb();
  });
  describe('Prisma createUser', () => {
    const data = { email: 'caca@cacamail.com', hash: 'aaaa' };
    it('should create a user', async () => {
      const user = await prisma.user.create({ data });
      userId = user.id;
      expect(user.email).toBe('caca@cacamail.com');
    });
    it('sould not work on duplicate mail', async () => {
      try {
        await prisma.user.create({ data });
      } catch (err) {
        expect(err).not.toBeUndefined;
      }
    });
  });
});
