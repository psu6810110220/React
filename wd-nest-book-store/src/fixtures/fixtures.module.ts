import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FixturesService } from './fixtures.service';
import { BookCategory } from '../book-category/entities/book-category.entity';
import { Book } from '../book/entities/book.entity';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookCategory, Book, User]),
    UserModule,
  ],
  providers: [FixturesService],
  exports: [FixturesService],
})
export class FixturesModule {}
