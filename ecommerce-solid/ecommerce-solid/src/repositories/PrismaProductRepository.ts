import { PrismaClient } from '@prisma/client';
import { IProductRepository } from './IProductRepository';
export class PrismaProductRepository implements IProductRepository {
  constructor(private prisma: PrismaClient) {}
  findById(id: number) { return this.prisma.product.findUnique({ where: { id } }); }
}
