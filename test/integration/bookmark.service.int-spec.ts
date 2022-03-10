import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { BookmarkService } from '../../src/bookmark/bookmark.service';
import { CreateBookmarkDto, EditBookmarkDto } from '../../src/bookmark/dto';

describe('Bookmark Service Integration Test', () => {
  let bookmarkService: BookmarkService;
  let prisma: PrismaService;
  let userId: number;
  let bookmarkId: number;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    prisma = moduleRef.get(PrismaService);
    bookmarkService = moduleRef.get(BookmarkService);
    await prisma.cleanDb();
  });
  describe('Create Bookmark', () => {
    const dto: CreateBookmarkDto = {
      title: 'create title',
      description: 'create desctiption',
      link: 'create link',
    };
    it('should create a user first', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'caca@cacamail.com',
          hash: 'aaaa',
        },
      });
      userId = user.id;
      expect(user.email).toBe('caca@cacamail.com');
    });
    it('Getbookmarks should get undefined if no bookmarks exist', async () => {
      const bookmarks = await bookmarkService.getBookmarks(userId);
      expect(bookmarks).toBeUndefined;
      expect(bookmarks.length).toBe(0);
    });
    it('should create a bookmark', async () => {
      const bookmark = await bookmarkService.createBookmark(userId, dto);
      bookmarkId = bookmark.id;
      expect(bookmark.title).toBe(dto.title);
      expect(bookmark.description).toBe(dto.description);
      expect(bookmark.link).toBe(dto.link);
    });
    it('Getbookmarks should get one bookmark', async () => {
      const bookmarks = await bookmarkService.getBookmarks(userId);
      expect(bookmarks.length).toBe(1);
    });
    it('Should find the created bookmark by id', async () => {
      const bookmark = await bookmarkService.getBookmarkById(
        userId,
        bookmarkId,
      );
      expect(bookmark.title).toBe(dto.title);
      expect(bookmark.description).toBe(dto.description);
      expect(bookmark.link).toBe(dto.link);
    });
  });
  describe('Edit Bookmark', () => {
    const editDto: EditBookmarkDto = {
      title: 'edited title',
      description: 'edited description',
      link: 'edited link',
    };
    it('should be able to edit a bookmark', async () => {
      const editBookmark = await bookmarkService.editBookmarkById(
        userId,
        bookmarkId,
        editDto,
      );
      expect(editBookmark.title).toBe(editDto.title);
      expect(editBookmark.description).toBe(editDto.description);
      expect(editBookmark.link).toBe(editDto.link);
    });
    it('should throw 403 error if user if is incorrect', async () => {
      await bookmarkService
        .editBookmarkById(999999, bookmarkId, editDto)
        .then((bookmark) => expect(bookmark).toBeUndefined)
        .catch((error) => expect(error.status).toBe(403));
    });
    it('Should find the edited bookmark by id', async () => {
      const bookmark = await bookmarkService.getBookmarkById(
        userId,
        bookmarkId,
      );
      expect(bookmark.title).toBe(editDto.title);
      expect(bookmark.description).toBe(editDto.description);
      expect(bookmark.link).toBe(editDto.link);
    });
  });
  describe('Delete Bookmark', () => {
    it('Should delete a bookmark by id', async () => {
      await bookmarkService.deleteBookmarkById(userId, bookmarkId);
    });
    it('Getbookmarks should get undefined if no bookmarks exist', async () => {
      const bookmarks = await bookmarkService.getBookmarks(userId);
      expect(bookmarks).toBeUndefined;
      expect(bookmarks.length).toBe(0);
    });
  });
});
