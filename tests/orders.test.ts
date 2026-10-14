import { test } from 'node:test';
import assert from 'node:assert/strict';
import { OrderService } from '../src/services/OrderService';
import { CreditCardPayment } from '../src/payments/CreditCardPayment';
import { PixPayment } from '../src/payments/PixPayment';
import { NewOrder } from '../src/repositories/IOrderRepository';
function fixture(failMail = false) {
  const saved: NewOrder[] = [];
  const service = new OrderService(
    { async findById(id) { return id === 1 ? { id, name: 'Livro', price: 100, type: 'physical' } : id === 2 ? { id, name: 'Ebook', price: 50, type: 'digital' } : null; } },
    { async create(order) { saved.push(order); return { ...order, id: saved.length }; } },
    new Map([['pix', new PixPayment()], ['credit_card', new CreditCardPayment()]]),
    { async notifyOrder() { if (failMail) throw new Error('SMTP indisponível'); return null; } }
  );
  return { service, saved };
}
const order = (items: unknown[], paymentMethod = 'pix', paymentDetails = {}) => ({ customer: 'cliente@example.com', items, paymentMethod, paymentDetails });
test('produto físico tem frete de 10 reais', async () => {
  const { service, saved } = fixture();
  const result = await service.processOrder(order([{ productId: 1, quantity: 1 }]));
  assert.equal(result.total, 110); assert.equal(saved.length, 1);
});
test('ebook não cobra frete; pedido misto soma preços e frete físico', async () => {
  const { service } = fixture();
  assert.equal((await service.processOrder(order([{ productId: 2, quantity: 2 }]))).total, 100);
  assert.equal((await service.processOrder(order([{ productId: 1, quantity: 2 }, { productId: 2, quantity: 1 }]))).total, 260);
});
test('linhas repetidas do mesmo produto cobram frete uma vez', async () => {
  const { service } = fixture();
  assert.equal((await service.processOrder(order([{ productId: 1, quantity: 1 }, { productId: 1, quantity: 1 }]))).total, 210);
});
test('validação rejeita pedidos inválidos sem salvar', async () => {
  const { service, saved } = fixture();
  for (const input of [null, order([]), order([{ productId: 1, quantity: -1 }]), order([{ productId: 1, quantity: 1.5 }]), order([{ productId: 99, quantity: 1 }]), order([{ productId: 1, quantity: 1 }], 'boleto'), { ...order([{ productId: 1, quantity: 1 }]), customer: 'invalido' }]) {
    await assert.rejects(() => service.processOrder(input));
  }
  assert.equal(saved.length, 0);
});
test('cartão aprovado salva; recusado ou incompleto não salva', async () => {
  const { service, saved } = fixture();
  const items = [{ productId: 1, quantity: 1 }];
  await service.processOrder(order(items, 'credit_card', { cardNumber: '1234567812345678', cvv: '123' }));
  await assert.rejects(() => service.processOrder(order(items, 'credit_card', { cardNumber: '1234567812345678', cvv: '000' })), /recusado/);
  await assert.rejects(() => service.processOrder(order(items, 'credit_card')), /CVV/);
  assert.equal(saved.length, 1);
});
test('falha de email não desfaz nem reporta falha do pedido confirmado', async () => {
  const { service, saved } = fixture(true);
  const result = await service.processOrder(order([{ productId: 2, quantity: 1 }]));
  assert.equal(result.notificationSent, false); assert.equal(saved.length, 1);
});
