import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService)
  async getBookmarks(userId: number ) {
    return this.prisma.
  }

  async getBookmarkById(userId: number, bookmarkId: number) {}

  async createBookmark(userId: number, dto: CreateBookmarkDto) {}

  async editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarkDto) {}

  async deleteBookmarkById(userId: number, bookmarkId: number) {}
}
