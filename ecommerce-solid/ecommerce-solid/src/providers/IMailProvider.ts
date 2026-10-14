export interface MailMessage { to: string; subject: string; text: string; }
export interface IMailProvider { sendMail(message: MailMessage): Promise<string | null>; }
