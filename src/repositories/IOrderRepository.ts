import { ProductData } from '../domain/IProduct';
export interface OrderItem extends ProductData { quantity: number; }
export interface NewOrder { customer: string; items: OrderItem[]; total: number; status: string; }
export interface SavedOrder extends NewOrder { id: number; }
export interface IOrderRepository { create(order: NewOrder): Promise<SavedOrder>; }
