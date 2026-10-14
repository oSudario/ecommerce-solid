import { Request, Response } from 'express';
import { OrderService } from '../services/OrderService';
import { AppError } from '../domain/AppError';
import logger from '../lib/logger';
export class OrderController {
  constructor(private service: OrderService) {}
  processOrder = async (req: Request, res: Response) => {
    try { return res.status(201).json(await this.service.processOrder(req.body)); }
    catch (error) {
      if (error instanceof AppError) return res.status(error.statusCode).json({ error: error.message });
      logger.error('Erro ao processar pedido', { error: error instanceof Error ? error.message : 'Erro desconhecido' });
      return res.status(500).json({ error: 'Erro interno' });
    }
  };
}
