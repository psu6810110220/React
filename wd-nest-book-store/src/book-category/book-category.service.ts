import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookCategoryDto } from './dto/create-book-category.dto';
import { UpdateBookCategoryDto } from './dto/update-book-category.dto';
import { BookCategory } from './entities/book-category.entity';

@Injectable()
export class BookCategoryService {
  constructor(
    @InjectRepository(BookCategory)
    private bookCategoryRepository: Repository<BookCategory>,
  ) {}

  async create(createBookCategoryDto: CreateBookCategoryDto): Promise<BookCategory> {
    const category = this.bookCategoryRepository.create(createBookCategoryDto);
    return await this.bookCategoryRepository.save(category);
  }

  async findAll(): Promise<BookCategory[]> {
    return await this.bookCategoryRepository.find({ relations: ['books'] });
  }

  async findOne(id: number): Promise<BookCategory> {
    const category = await this.bookCategoryRepository.findOne({
      where: { id },
      relations: ['books'],
    });
    if (!category) {
      throw new NotFoundException(`Book category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: number, updateBookCategoryDto: UpdateBookCategoryDto): Promise<BookCategory> {
    const category = await this.findOne(id);
    Object.assign(category, updateBookCategoryDto);
    return await this.bookCategoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.bookCategoryRepository.remove(category);
  }
}
