import { Module } from '@nestjs/common';
import { BookCategoryService } from './book-category.service';
import { BookCategoryController } from './book-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookCategory } from './entities/book-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookCategory])],
  controllers: [BookCategoryController],
  providers: [BookCategoryService],
  exports: [TypeOrmModule],
})
export class BookCategoryModule {}
