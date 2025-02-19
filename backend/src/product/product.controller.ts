import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * Создание продукта вместе с загрузкой фотографии.
   * Ожидается, что данные передаются в формате multipart/form-data,
   * где текстовые поля соответствуют CreateProductDto, а файл передается в поле "photo".
   */
  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ) {
    if (!file) {
      throw new BadRequestException('Photo is required');
    }
    createProductDto.photo = file.filename;
    return this.productService.create(createProductDto);
  }

  /**
   * Получение списка продуктов с поддержкой фильтрации, сортировки и пагинации.
   * Параметры передаются через query-параметры.
   */
  @Get()
  findAll(@Query() query: any) {
    return this.productService.findAll(query);
  }

  /**
   * Получение продукта по идентификатору.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  /**
   * Обновление продукта.
   * Поддерживается опциональная загрузка нового файла.
   * Если файл передан, он сохраняется и его имя передаётся в update DTO.
   */
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      updateProductDto.photo = file.filename;
    }
    return this.productService.update(+id, updateProductDto);
  }

  /**
   * Удаление продукта по идентификатору.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
