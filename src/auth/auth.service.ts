import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto) {
    // generate rhe password
    const hash = await argon.hash(dto.password);
    // save the new user
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      delete user.hash;
      // return the saed user
      return user;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          // prisma err code of unique field
          throw new ForbiddenException('Credentials already taken');
        }
      }
      throw err;
    }
  }
  async signin(dto: AuthDto) {
    // find user by email
    const user = await this.prisma.user.findFirst({
      // findunique not working for me
      where: {
        email: dto.email,
      },
    });
    // if user doesnt exist throw exception
    if (!user) throw new ForbiddenException('credentials incorrect');
    // compare passwords

    const pwMatches = await argon.verify(user.hash, dto.password);
    // if passwd incorrect throw exception
    if (!pwMatches) throw new ForbiddenException('credentials incorrect');
    // send back user
    delete user.hash;
    return user;
  }
}
