import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          // url: 'postgresql://root:root@localhost:5432/nest?schema=public',
          url: 'postgresql://root:root@localhost:5432/nest?schema=public&connect_timeout=30',
        },
      },
    });
  }
}
