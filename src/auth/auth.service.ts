import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
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
      return this.signToken(user.id, user.email);
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
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });
    return {
      access_token: token,
    };
  }
}
