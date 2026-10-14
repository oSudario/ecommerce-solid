import { IProduct } from './IProduct';
export class PhysicalProduct implements IProduct {
  readonly type = 'physical';
  constructor(public id: number, public name: string, public price: number) {}
  calculateFreight(): number { return 10; }
}
