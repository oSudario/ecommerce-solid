import { IMailProvider } from '../providers/IMailProvider';
import { SavedOrder } from '../repositories/IOrderRepository';
export interface INotificationService { notifyOrder(order: SavedOrder): Promise<string | null>; }
export class NotificationService implements INotificationService {
  constructor(private mailProvider: IMailProvider) {}
  notifyOrder(order: SavedOrder): Promise<string | null> {
    return this.mailProvider.sendMail({
      to: order.customer,
      subject: `Confirmação do Pedido #${order.id}`,
      text: `Olá, seu pedido #${order.id}, no valor de R$ ${order.total.toFixed(2)}, foi confirmado. Itens: ${order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}.`
    });
  }
}
