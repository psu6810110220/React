import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FixturesService } from './fixtures.service';
import { BookCategory } from '../book-category/entities/book-category.entity';
import { Book } from '../book/entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookCategory, Book])],
  providers: [FixturesService],
  exports: [FixturesService],
})
export class FixturesModule {}
