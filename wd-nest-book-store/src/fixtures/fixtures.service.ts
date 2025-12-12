import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookCategory } from '../book-category/entities/book-category.entity';
import { Book } from '../book/entities/book.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class FixturesService implements OnModuleInit {
  private readonly logger = new Logger(FixturesService.name);

  constructor(
    @InjectRepository(BookCategory)
    private bookCategoryRepository: Repository<BookCategory>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    private userService: UserService,
  ) {}

  async onModuleInit() {
    // Only run fixtures in development mode
    if (process.env.NODE_ENV === 'production') {
      this.logger.warn('Fixtures are disabled in production mode');
      return;
    }

    this.logger.log('Running fixtures in development mode...');
    await this.loadFixtures();
  }

  async loadFixtures() {
    try {
      // Load mock data (no need to clear - dropSchema handles it)
      await this.createTestUser();
      const categories = await this.createCategories();
      await this.createBooks(categories);

      this.logger.log('Fixtures loaded successfully!');
    } catch (error) {
      this.logger.error('Error loading fixtures:', error.message);
    }
  }

  private async createTestUser() {
    this.logger.log('Creating test user...');
    
    // Check if test user already exists
    const existingUser = await this.userService.findByUsername('demo');
    if (existingUser) {
      this.logger.log('Test user already exists, skipping creation');
      return;
    }

    try {
      await this.userService.createUser('demo', '1234', 'demo@example.com');
      this.logger.log('Test user created: username=demo, password=1234');
    } catch (error) {
      this.logger.warn('Could not create test user:', error.message);
    }
  }

  private async createCategories(): Promise<BookCategory[]> {
    this.logger.log('Creating book categories...');

    const categoriesData = [
      {
        name: 'Fiction',
        description: 'Fictional stories and novels',
      },
      {
        name: 'Science Fiction',
        description: 'Science fiction and fantasy books',
      },
      {
        name: 'Non-Fiction',
        description: 'Educational and informational books',
      },
      {
        name: 'Programming',
        description: 'Software development and programming books',
      },
      {
        name: 'Biography',
        description: 'Life stories and memoirs',
      },
    ];

    const categories: BookCategory[] = [];
    for (const data of categoriesData) {
      const category = this.bookCategoryRepository.create(data);
      const saved = await this.bookCategoryRepository.save(category);
      categories.push(saved);
    }

    this.logger.log(`Created ${categories.length} categories`);
    return categories;
  }

  private async createBooks(categories: BookCategory[]) {
    this.logger.log('Creating books...');

    const booksData = [
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        description: 'A classic American novel set in the Jazz Age',
        price: 12.99,
        isbn: '978-0743273565',
        stock: 50,
        coverUrl: '/images/books/great-gatsby.jpg',
        likeCount: 156,
        categoryId: categories[0].id, // Fiction
      },
      {
        title: '1984',
        author: 'George Orwell',
        description: 'A dystopian social science fiction novel',
        price: 14.99,
        isbn: '978-0451524935',
        stock: 75,
        coverUrl: '/images/books/1984.jpg',
        likeCount: 203,
        categoryId: categories[0].id, // Fiction
      },
      {
        title: 'Dune',
        author: 'Frank Herbert',
        description: 'A science fiction masterpiece',
        price: 18.99,
        isbn: '978-0441172719',
        stock: 40,
        coverUrl: '/images/books/dune.jpg',
        likeCount: 342,
        categoryId: categories[1].id, // Science Fiction
      },
      {
        title: 'The Martian',
        author: 'Andy Weir',
        description: 'A stranded astronaut must survive on Mars',
        price: 15.99,
        isbn: '978-0553418026',
        stock: 60,
        coverUrl: '/images/books/martian.jpg',
        likeCount: 189,
        categoryId: categories[1].id, // Science Fiction
      },
      {
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        description: 'A brief history of humankind',
        price: 22.99,
        isbn: '978-0062316097',
        stock: 100,
        coverUrl: '/images/books/sapiens.jpg',
        likeCount: 427,
        categoryId: categories[2].id, // Non-Fiction
      },
      {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        description: 'A handbook of agile software craftsmanship',
        price: 45.99,
        isbn: '978-0132350884',
        stock: 30,
        coverUrl: '/images/books/clean-code.jpg',
        likeCount: 512,
        categoryId: categories[3].id, // Programming
      },
      {
        title: 'The Pragmatic Programmer',
        author: 'David Thomas, Andrew Hunt',
        description: 'Your journey to mastery',
        price: 42.99,
        isbn: '978-0135957059',
        stock: 25,
        coverUrl: '/images/books/pragmatic-programmer.jpg',
        likeCount: 391,
        categoryId: categories[3].id, // Programming
      },
      {
        title: 'Design Patterns',
        author: 'Gang of Four',
        description: 'Elements of reusable object-oriented software',
        price: 54.99,
        isbn: '978-0201633610',
        stock: 20,
        coverUrl: '/images/books/design-patterns.jpg',
        likeCount: 284,
        categoryId: categories[3].id, // Programming
      },
      {
        title: 'Steve Jobs',
        author: 'Walter Isaacson',
        description: 'The exclusive biography',
        price: 19.99,
        isbn: '978-1451648539',
        stock: 45,
        coverUrl: '/images/books/steve-jobs.jpg',
        likeCount: 267,
        categoryId: categories[4].id, // Biography
      },
      {
        title: 'Educated',
        author: 'Tara Westover',
        description: 'A memoir about education and self-invention',
        price: 16.99,
        isbn: '978-0399590504',
        stock: 55,
        coverUrl: '/images/books/educated.jpg',
        likeCount: 198,
        categoryId: categories[4].id, // Biography
      },
    ];

    for (const data of booksData) {
      const book = this.bookRepository.create(data);
      await this.bookRepository.save(book);
    }

    this.logger.log(`Created ${booksData.length} books`);
  }
}
