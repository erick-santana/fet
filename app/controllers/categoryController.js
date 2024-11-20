import { 
  createCategoryService, 
  updateCategoryService, 
  removeCategoryService, 
  listCategoryService, 
  readCategoryService, 
  productsByCategoryService 
} from "../services/categoryService.js";

// Função responsável por criar uma nova categoria. Ela utiliza o serviço createCategoryService para gerenciar a lógica de criação.
// Em caso de erro, retorna uma mensagem de erro no console e na resposta da API.
export const create = async (req, res) => {
  try {
    await createCategoryService(req, res);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
};

// Função responsável por atualizar uma categoria existente. Chama o serviço updateCategoryService.
// Em caso de erro, loga o erro no console e retorna o erro para o usuário.
export const update = async (req, res) => {
  try {
    await updateCategoryService(req, res);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

// Função responsável por remover uma categoria. Chama o serviço removeCategoryService.
// Em caso de erro, retorna o erro no console e na resposta da API.
export const remove = async (req, res) => {
  try {
    await removeCategoryService(req, res);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

// Função que lista todas as categorias disponíveis. Utiliza o serviço listCategoryService para isso.
// Em caso de erro, loga e retorna a mensagem de erro na resposta.
export const list = async (req, res) => {
  try {
    await listCategoryService(req, res);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

// Função responsável por retornar uma categoria específica com base no slug (identificador único). Chama o serviço readCategoryService.
// Em caso de erro, loga e retorna a mensagem de erro.
export const read = async (req, res) => {
  try {
    await readCategoryService(req, res);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

// Função que retorna os produtos de uma categoria específica. Chama o serviço productsByCategoryService.
// Em caso de erro, loga no console mas não retorna mensagem na resposta.
export const productsByCategory = async (req, res) => {
  try {
    await productsByCategoryService(req, res);
  } catch (err) {
    console.log(err);
  }
};
