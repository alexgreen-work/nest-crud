import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Connection } from 'typeorm';
import { Product } from '../product/product.entity';
import { faker } from '@faker-js/faker';

async function seedProducts() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  try {
    const connection = appContext.get(Connection);
    const productRepository = connection.getRepository(Product);

    const products = [];
    for (let i = 0; i < 100; i++) {
      products.push({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        discountPrice: parseFloat(faker.commerce.price()),
        sku: faker.string.alphanumeric(10),
      });
    }

    await productRepository.save(products);
    console.log('Seeding finished successfully with 100 products!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await appContext.close();
    process.exit(0);
  }
}

seedProducts().catch(error => {
  console.error('Unexpected error during seeding:', error);
  process.exit(1);
});
