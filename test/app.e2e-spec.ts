import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    // per a la validació del DTO
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3001);
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3001');
  });
  afterAll(() => {
    app.close();
  });
  const dto: AuthDto = {
    email: 'victor@gmail.com',
    password: '123',
  };
  describe('Auth', () => {
    describe('Signup', () => {
      it('should throw an error if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw an error if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw an error if no body', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });
    describe('Signin', () => {
      it('should throw an error if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw an error if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw an error if no body', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });
  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum.spec().get('/users/me').expectStatus(200).withHeaders({
          // fijarse en  la $S de pactum
          Authorization: `Bearer $S{userAt}`,
        });
      });
    });
    describe('Edit User', () => {
      describe('Get me', () => {
        it('should get edit user', () => {
          const dto: EditUserDto = {
            firstName: 'Vladimir',
            email: 'codewithvlad@gmail.com',
          };
          return pactum
            .spec()
            .patch('/users')
            .withHeaders({
              Authorization: `Bearer $S{userAt}`,
            })
            .withBody(dto)
            .expectStatus(200)
            .expectBodyContains(dto.firstName)
            .expectBodyContains(dto.email);
        });
      });
    });
  });
  describe('Bookmark', () => {
    describe('Create bookmarks', () => {});
    describe('Get bookmarks', () => {});
    describe('Get bookmarks by id', () => {});
    describe('Edit bookmark by id', () => {});
    describe('Delete bookmarks', () => {});
  });
});
