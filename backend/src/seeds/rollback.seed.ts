import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Connection } from 'typeorm';
import { Product } from '../product/product.entity';

async function rollbackProducts() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  try {
    const connection = appContext.get(Connection);
    const productRepository = connection.getRepository(Product);
    await productRepository.clear();
    console.log('Rollback finished successfully!');
  } catch (error) {
    console.error('Error during rollback:', error);
  } finally {
    await appContext.close();
    process.exit(0);
  }
}

rollbackProducts().catch((error) => {
  console.error('Unexpected error during rollback:', error);
  process.exit(1);
});
