export type PaymentDetails = Record<string, unknown>;
export interface IPaymentMethod { process(amount: number, details: PaymentDetails): Promise<void>; }
