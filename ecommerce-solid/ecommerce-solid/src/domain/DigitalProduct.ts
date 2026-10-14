import { IProduct } from './IProduct';
export class DigitalProduct implements IProduct {
  readonly type = 'digital';
  constructor(public id: number, public name: string, public price: number) {}
  calculateFreight(): number { return 0; }
}
