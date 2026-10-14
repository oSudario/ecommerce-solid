import { IPaymentMethod, PaymentDetails } from './IPaymentMethod';
import { AppError } from '../domain/AppError';
import logger from '../lib/logger';
export class CreditCardPayment implements IPaymentMethod {
  async process(amount: number, details: PaymentDetails): Promise<void> {
    if (typeof details.cardNumber !== 'string' || !/^\d{16}$/.test(details.cardNumber) ||
        typeof details.cvv !== 'string' || !/^\d{3,4}$/.test(details.cvv)) {
      throw new AppError('Informe um cartão com 16 dígitos e um CVV válido');
    }
    if (details.cvv === '000') throw new AppError('Cartão recusado', 402);
    logger.info(`Pagamento simulado de R$ ${amount.toFixed(2)}, cartão final ${details.cardNumber.slice(-4)}`);
  }
}
