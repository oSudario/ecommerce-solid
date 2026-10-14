# E-commerce com SOLID

Refatoração do projeto didático de https://github.com/maikonb/ecommerce-versao-com-erros-solid.
Backend em TypeScript 5, Express e Prisma com SQLite. Os pagamentos são simulados, sem movimentação financeira.

## Instalar e executar

Requisito: Node.js 20 ou superior com npm.
Abra o terminal na pasta do projeto e execute:

```bash
npm ci
npm run setup
npm run build
npm start
```

API: http://localhost:3000. Para desenvolvimento, use `npm run dev` após o setup.
O setup gera o cliente Prisma, aplica as migrações e cadastra os produtos de teste. Pode ser executado novamente.
Não é necessário configurar arquivo .env ou instalar um servidor de banco de dados.

## Testar

```bash
npm test
```

Saúde da API: `GET /health`.
Criação de pedido: `POST /orders`, com cabeçalho `Content-Type: application/json`.
Exemplo de corpo para Postman ou Insomnia:

```json
{
  "customer": "cliente@example.com",
  "items": [{ "productId": 1, "quantity": 1 }],
  "paymentMethod": "credit_card",
  "paymentDetails": { "cardNumber": "1234567812345678", "cvv": "123" }
}
```

O produto 1 custa R$ 100 e cobra R$ 10 de frete por produto distinto no pedido, independentemente da quantidade. O produto 2 é digital, custa R$ 50 e não cobra frete. Linhas repetidas são agrupadas.
O primeiro exemplo retorna HTTP 201 e total 110. Para testar o ebook, use productId 2: total 50 com quantidade 1.
Para Pix, use `"paymentMethod": "pix"` e `"paymentDetails": {}`. Débito também está disponível como `debit_card`.
No cartão, CVV `000` simula recusa (HTTP 402). Pedidos inválidos retornam HTTP 400.

Exemplo com curl (Linux/macOS/Git Bash):

```bash
curl http://localhost:3000/orders -H 'Content-Type: application/json' -d '{"customer":"cliente@example.com","items":[{"productId":2,"quantity":1}],"paymentMethod":"pix","paymentDetails":{}}'
```

## Notificações

Por padrão, os emails são registrados no terminal pelo ConsoleMailProvider, sem acesso a SMTP. `emailPreview` é null nesse modo e `notificationSent` indica que o provider concluiu a notificação de teste.
Para usar emails de teste e links de visualização do Ethereal, defina MAIL_PROVIDER=ethereal antes de iniciar:

PowerShell:
```powershell
$env:MAIL_PROVIDER="ethereal"
npm start
```

Linux/macOS/Git Bash:
```bash
MAIL_PROVIDER=ethereal npm start
```

O Ethereal precisa de internet e acesso SMTP. Se a notificação falhar, o pedido permanece confirmado e a resposta informa notificationSent=false, evitando que o cliente repita um pedido já salvo.

## Organização e SOLID

- SRP: OrderController trata HTTP; OrderService coordena o pedido; NotificationService monta a mensagem; repositories cuidam da persistência; providers cuidam do envio.
- OCP: métodos de pagamento implementam IPaymentMethod. Uma nova estratégia pode ser registrada em app.ts sem modificar OrderService.
- LSP: PhysicalProduct e DigitalProduct implementam o mesmo contrato e calculam seu próprio frete. ProductFactory converte os dados do banco em objetos de domínio.
- ISP: contratos pequenos e específicos para produtos, pedidos, pagamentos e notificações. Produto digital não precisa implementar operações de entrega física.
- DIP: OrderService depende de interfaces; Prisma e Nodemailer ficam nas implementações concretas. app.ts monta e injeta as dependências.

Pastas: controllers, domain, services, repositories, payments, providers e lib dentro de src. Migrações e seed em prisma. Testes em tests.

## Publicar para entrega

Crie um repositório público na sua conta GitHub. Envie os arquivos deste projeto, incluindo package-lock.json e a pasta prisma, sem node_modules, dist ou banco gerado.
Abra a página do repositório em uma janela anônima para confirmar o acesso público. Entregue o link do seu próprio repositório na caixa de texto da atividade.
