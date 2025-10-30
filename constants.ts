// Número de créditos gratuitos ao criar uma conta
export const INITIAL_FREE_CREDITS = 5;

// Pacotes de créditos avulsos (quantidade e preço)
export const CREDIT_PACKAGES = [
  { credits: 10, price: 'R$ 19,90' },
  { credits: 20, price: 'R$ 29,90' },
];

// Pacote da assinatura mensal (40 créditos renovados por mês)
export const SUBSCRIPTION_PACKAGE = {
  credits: 40,
  price: 'R$ 39,90',
  interval: 'mês',
};
