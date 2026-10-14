import nodemailer from 'nodemailer';
import { getMailClient } from '../lib/mail';
import { IMailProvider, MailMessage } from './IMailProvider';
export class EtherealMailProvider implements IMailProvider {
  async sendMail(message: MailMessage): Promise<string | null> {
    const mailer = await getMailClient();
    const info = await mailer.sendMail({ from: '"DevStore" <noreply@devstore.com>', ...message });
    return nodemailer.getTestMessageUrl(info) || null;
  }
}
