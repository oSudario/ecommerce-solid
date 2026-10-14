import { AppError } from '../domain/AppError';
import { ProductFactory } from '../domain/ProductFactory';
import { IOrderRepository, OrderItem } from '../repositories/IOrderRepository';
import { IProductRepository } from '../repositories/IProductRepository';
import { IPaymentMethod, PaymentDetails } from '../payments/IPaymentMethod';
import { INotificationService } from './NotificationService';
import logger from '../lib/logger';
export class OrderService {
  constructor(
    private products: IProductRepository,
    private orders: IOrderRepository,
    private payments: ReadonlyMap<string, IPaymentMethod>,
    private notifications: INotificationService
  ) {}
  async processOrder(input: unknown) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new AppError('Pedido inválido');
    const { customer, items, paymentMethod, paymentDetails } = input as Record<string, unknown>;
    if (typeof customer !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer)) throw new AppError('Informe um email válido');
    if (!Array.isArray(items) || items.length === 0) throw new AppError('Carrinho vazio');
    const payment = typeof paymentMethod === 'string' ? this.payments.get(paymentMethod) : undefined;
    if (!payment) throw new AppError('Método de pagamento não suportado');
    if (paymentDetails !== undefined && (!paymentDetails || typeof paymentDetails !== 'object' || Array.isArray(paymentDetails))) throw new AppError('Dados de pagamento inválidos');
    const quantities = new Map<number, number>();
    for (const item of items) {
      if (!item || !Number.isSafeInteger(item.productId) || item.productId <= 0 || !Number.isSafeInteger(item.quantity) || item.quantity <= 0) throw new AppError('Produto e quantidade devem ser inteiros positivos');
      const quantity = (quantities.get(item.productId) || 0) + item.quantity;
      if (!Number.isSafeInteger(quantity)) throw new AppError('Quantidade inválida');
      quantities.set(item.productId, quantity);
    }
    let total = 0;
    const orderItems: OrderItem[] = [];
    for (const [id, quantity] of quantities) {
      const data = await this.products.findById(id);
      if (!data) throw new AppError(`Produto ${id} não encontrado`);
      const product = ProductFactory.createProduct(data);
      total += product.price * quantity + product.calculateFreight();
      orderItems.push({ ...data, quantity });
    }
    total = Math.round(total * 100) / 100;
    if (!Number.isFinite(total) || total <= 0) throw new AppError('Total do pedido inválido');
    await payment.process(total, (paymentDetails || {}) as PaymentDetails);
    const order = await this.orders.create({ customer, items: orderItems, total, status: 'confirmed' });
    let emailPreview: string | null = null;
    let notificationSent = false;
    try {
      emailPreview = await this.notifications.notifyOrder(order);
      notificationSent = true;
    } catch (error) {
      logger.error('Pedido salvo, mas a notificação falhou', { error: error instanceof Error ? error.message : 'Erro desconhecido' });
    }
    return { message: 'Pedido processado com sucesso', orderId: order.id, total, emailPreview, notificationSent };
  }
}
