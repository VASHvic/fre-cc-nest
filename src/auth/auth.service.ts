import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  signup() {
    console.log();
    return ' i am sinup';
  }
  signin() {
    return ' i am singins';
  }
}
