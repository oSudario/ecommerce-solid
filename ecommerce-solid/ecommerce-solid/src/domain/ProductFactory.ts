import { IProduct, ProductData } from './IProduct';
import { PhysicalProduct } from './PhysicalProduct';
import { DigitalProduct } from './DigitalProduct';
export class ProductFactory {
  static createProduct(data: ProductData): IProduct {
    switch (data.type) {
      case 'physical': return new PhysicalProduct(data.id, data.name, data.price);
      case 'digital': return new DigitalProduct(data.id, data.name, data.price);
      default: throw new Error('Tipo de produto desconhecido');
    }
  }
}
