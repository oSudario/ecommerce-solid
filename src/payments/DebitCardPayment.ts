import { IPaymentMethod, PaymentDetails } from './IPaymentMethod';
import logger from '../lib/logger';
export class DebitCardPayment implements IPaymentMethod {
  async process(amount: number, _details: PaymentDetails): Promise<void> {
    logger.info(`Pagamento em débito simulado: R$ ${amount.toFixed(2)}`);
  }
}
