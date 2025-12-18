import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BookCategory } from '../../book-category/entities/book-category.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  isbn: string;

  @Column({ default: 0 })
  stock: number;

  @Column({ nullable: true })
  coverUrl: string;

  @Column({ default: 0 })
  likeCount: number;

  @ManyToOne(() => BookCategory, (category) => category.books)
  @JoinColumn({ name: 'categoryId' })
  category: BookCategory;

  @Column()
  categoryId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
