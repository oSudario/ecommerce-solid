import { IPaymentMethod, PaymentDetails } from './IPaymentMethod';
import logger from '../lib/logger';
export class PixPayment implements IPaymentMethod {
  async process(amount: number, _details: PaymentDetails): Promise<void> {
    logger.info(`Pagamento Pix simulado: R$ ${amount.toFixed(2)}`);
  }
}
