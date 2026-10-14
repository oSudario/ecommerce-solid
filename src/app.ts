import express from 'express';
import { PrismaClient } from '@prisma/client';
import { OrderController } from './controllers/OrderController';
import { OrderService } from './services/OrderService';
import { NotificationService } from './services/NotificationService';
import { PrismaOrderRepository } from './repositories/PrismaOrderRepository';
import { PrismaProductRepository } from './repositories/PrismaProductRepository';
import { CreditCardPayment } from './payments/CreditCardPayment';
import { DebitCardPayment } from './payments/DebitCardPayment';
import { PixPayment } from './payments/PixPayment';
import { IPaymentMethod } from './payments/IPaymentMethod';
import { EtherealMailProvider } from './providers/EtherealMailProvider';
import { ConsoleMailProvider } from './providers/ConsoleMailProvider';
const prisma = new PrismaClient();
const payments = new Map<string, IPaymentMethod>([
  ['credit_card', new CreditCardPayment()],
  ['debit_card', new DebitCardPayment()],
  ['pix', new PixPayment()]
]);
const mailProvider = process.env.MAIL_PROVIDER === 'ethereal' ? new EtherealMailProvider() : new ConsoleMailProvider();
const service = new OrderService(new PrismaProductRepository(prisma), new PrismaOrderRepository(prisma), payments, new NotificationService(mailProvider));
const controller = new OrderController(service);
const app = express();
app.use(express.json());
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.post('/orders', controller.processOrder);
export default app;
