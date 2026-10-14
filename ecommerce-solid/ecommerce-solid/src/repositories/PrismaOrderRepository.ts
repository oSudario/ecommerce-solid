import { PrismaClient } from '@prisma/client';
import { IOrderRepository, NewOrder, SavedOrder } from './IOrderRepository';
export class PrismaOrderRepository implements IOrderRepository {
  constructor(private prisma: PrismaClient) {}
  async create(order: NewOrder): Promise<SavedOrder> {
    const saved = await this.prisma.order.create({ data: { ...order, items: JSON.stringify(order.items) } });
    return { ...order, id: saved.id };
  }
}
