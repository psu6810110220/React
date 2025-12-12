import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive, Min } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsString()
  @IsOptional()
  isbn?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsString()
  @IsOptional()
  coverUrl?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  likeCount?: number;

  @IsNumber()
  @IsNotEmpty()
  categoryId: number;
}
