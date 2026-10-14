import { IMailProvider, MailMessage } from './IMailProvider';
import logger from '../lib/logger';
export class ConsoleMailProvider implements IMailProvider {
  async sendMail(message: MailMessage): Promise<null> {
    logger.info(`Email de teste para ${message.to}: ${message.subject} — ${message.text}`);
    return null;
  }
}
