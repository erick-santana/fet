import {
  getOrders,
  allOrders,
  processPaymentService,
  orderStatusService,
} from "../services/orderService.js";

// Função responsável por buscar os pedidos do usuário logado.
// Chama o serviço getOrders, que gerencia a lógica de busca de pedidos.
// Em caso de erro, o erro é logado no console.
export const getUserOrders = async (req, res) => {
  try {
    await getOrders(req, res);
  } catch (err) {
    console.log(err);
  }
};

// Função responsável por buscar todos os pedidos do sistema (geralmente para administradores).
// Utiliza o serviço allOrders, que lida com a busca de todos os pedidos.
// Erros são logados no console.
export const getAllOrders = async (req, res) => {
  try {
    await allOrders(req, res);
  } catch (err) {
    console.log(err);
  }
};

// Função que processa o pagamento de um pedido.
// Chama o serviço processPaymentService, que trata da lógica de pagamento.
// Qualquer erro durante o processo é logado no console.
export const processPayment = async (req, res) => {
  try {
    await processPaymentService(req, res);
  } catch (err) {
    console.log(err);
  }
};

// Função responsável por atualizar o status de um pedido.
// Utiliza o serviço orderStatusService, que gerencia a atualização do status.
// Em caso de erro, o erro é registrado no console.
export const orderStatus = async (req, res) => {
  try {
    await orderStatusService(req, res);
  } catch (err) {
    console.log(err);
  }
};
