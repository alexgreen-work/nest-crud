import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository, Like, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  // Создание товара с проверкой на уникальность SKU
  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Проверяем, существует ли уже продукт с таким SKU
    const existingProduct = await this.productRepository.findOneBy({ sku: createProductDto.sku });
    if (existingProduct) {
      throw new BadRequestException(`Product with SKU "${createProductDto.sku}" already exists.`);
    }
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  // Получение списка товаров с пагинацией, фильтрацией и сортировкой
  async findAll(query: any): Promise<{ data: Product[]; count: number }> {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    // Фильтрация по текстовым полям
    if (query.name) {
      where.name = Like(`%${query.name}%`);
    }
    if (query.description) {
      where.description = Like(`%${query.description}%`);
    }
    if (query.sku) {
      where.sku = Like(`%${query.sku}%`);
    }
    if (query.photo) {
      where.photo = Like(`%${query.photo}%`);
    }

    // Фильтрация по диапазону цены
    if (query.minPrice && query.maxPrice) {
      where.price = Between(Number(query.minPrice), Number(query.maxPrice));
    } else if (query.minPrice) {
      where.price = MoreThanOrEqual(Number(query.minPrice));
    } else if (query.maxPrice) {
      where.price = LessThanOrEqual(Number(query.maxPrice));
    }

    // Фильтрация по диапазону цены со скидкой
    if (query.minDiscountPrice && query.maxDiscountPrice) {
      where.discountPrice = Between(Number(query.minDiscountPrice), Number(query.maxDiscountPrice));
    } else if (query.minDiscountPrice) {
      where.discountPrice = MoreThanOrEqual(Number(query.minDiscountPrice));
    } else if (query.maxDiscountPrice) {
      where.discountPrice = LessThanOrEqual(Number(query.maxDiscountPrice));
    }

    // Сортировка
    const sortBy = query.sortBy || 'id';
    const order = query.order && query.order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const [data, count] = await this.productRepository.findAndCount({
      where,
      order: { [sortBy]: order },
      skip,
      take: limit,
    });

    return { data, count };
  }

  // Получение товара по id
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found.`);
    }
    return product;
  }

  // Обновление товара
  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  // Удаление товара (и связанной фотографии, если имеется)
  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    if (product.photo) {
      this.deleteFile(product.photo);
    }
    await this.productRepository.remove(product);
  }

  // Загрузка фотографии для товара
  async uploadPhoto(id: number, file: Express.Multer.File): Promise<Product> {
    const product = await this.findOne(id);
    if (product.photo) {
      this.deleteFile(product.photo);
    }
    product.photo = file.filename;
    return this.productRepository.save(product);
  }

  // Удаление фотографии товара
  async deletePhoto(id: number): Promise<Product> {
    const product = await this.findOne(id);
    if (product.photo) {
      this.deleteFile(product.photo);
      product.photo = null;
      return this.productRepository.save(product);
    }
    throw new NotFoundException('Photo not found for this product.');
  }

  // Утилита для удаления файла с диска
  private deleteFile(filename: string) {
    const filePath = path.join(__dirname, '..', '..', 'uploads', filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
