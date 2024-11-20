import Product from "../models/product.js"; // Importa o modelo de Produto para interagir com o banco de dados.
import fs from "fs"; // Importa o módulo do sistema de arquivos para manipulação de arquivos.
import slugify from "slugify"; // Utilizado para criar slugs a partir dos nomes dos produtos.
import braintree from "braintree"; // Integração com o sistema de pagamento Braintree.
import dotenv from "dotenv"; // Carrega as variáveis de ambiente.
import sgMail from "@sendgrid/mail"; // Integração com o serviço de email SendGrid.

// Carrega as variáveis de ambiente
dotenv.config();

// Configura a chave da API do SendGrid
sgMail.setApiKey(process.env.SENDGRID_KEY);

// Configura o gateway de pagamento Braintree com as credenciais fornecidas
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox, // Ambiente de sandbox para testar transações.
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

// Serviço para criar um novo produto
export const createProductService = async (req, res) => {
  // Desestrutura os dados do produto do corpo da requisição
  const { name, description, price, category, quantity, shipping } = req.fields;
  const { photo } = req.files;

  // Validação dos campos obrigatórios
  switch (true) {
    case !name.trim():
      return res.json({ error: "Nome é obrigatório" });
    case !description.trim():
      return res.json({ error: "Descrição é obrigatória" });
    case !price.trim():
      return res.json({ error: "Preço é obrigatório" });
    case !category.trim():
      return res.json({ error: "Categoria é obrigatória" });
    case !quantity.trim():
      return res.json({ error: "Quantidade é obrigatória" });
    case !shipping.trim():
      return res.json({ error: "Envio é obrigatório" });
    case photo && photo.size > 1000000:
      return res.json({ error: "A imagem deve ter menos de 1mb" });
  }

  // Cria um novo produto e gera o slug com base no nome
  const product = new Product({ ...req.fields, slug: slugify(name) });

  // Se houver uma foto, lê o arquivo da foto e salva suas informações
  if (photo) {
    product.photo.data = fs.readFileSync(photo.path);
    product.photo.contentType = photo.type;
  }

  // Salva o produto no banco de dados e retorna como resposta
  await product.save();
  res.json(product);
};

// Serviço para listar os produtos
export const listProductsService = async (req, res) => {
  // Busca todos os produtos, populando as categorias e excluindo as fotos
  const products = await Product.find({})
    .populate("category")
    .select("-photo")
    .limit(12)
    .sort({ createdAt: -1 }); // Ordena pela data de criação, do mais recente ao mais antigo.

  res.json(products);
};

// Serviço para ler um produto específico
export const readProductService = async (req, res) => {
  // Busca o produto pelo slug e popula a categoria, excluindo a foto
  const product = await Product.findOne({ slug: req.params.slug })
    .select("-photo")
    .populate("category");

  res.json(product);
};

// Serviço para exibir a foto do produto
export const productPhotoService = async (req, res) => {
  // Busca o produto pelo ID e seleciona apenas a foto
  const product = await Product.findById(req.params.productId).select("photo");
  if (product.photo.data) {
    res.set("Content-Type", product.photo.contentType);
    return res.send(product.photo.data); // Retorna a foto como resposta.
  }
};

// Serviço para remover um produto
export const removeProductService = async (req, res) => {
  // Remove o produto pelo ID e exclui a foto dos dados retornados
  const product = await Product.findByIdAndDelete(req.params.productId).select("-photo");
  res.json(product);
};

// Serviço para atualizar um produto existente
export const updateProductService = async (req, res) => {
  const { name, description, price, category, quantity, shipping } = req.fields;
  const { photo } = req.files;

  // Validação dos campos obrigatórios
  switch (true) {
    case !name.trim():
      return res.json({ error: "Nome é obrigatório" });
    case !description.trim():
      return  res.json({ error: "Descrição é obrigatória" });
    case !price.trim():
      return res.json({ error: "Preço é obrigatório" });
    case !category.trim():
      return res.json({ error: "Categoria é obrigatória" });
    case !quantity.trim():
      return res.json({ error: "Quantidade é obrigatória" });
    case !shipping.trim():
      return res.json({ error: "Envio é obrigatório" });
    case photo && photo.size > 1000000:
      return res.json({ error: "A imagem deve ter menos de 1mb" });
  }

  // Atualiza o produto pelo ID e gera um novo slug com base no nome atualizado
  const product = await Product.findByIdAndUpdate(
    req.params.productId,
    { ...req.fields, slug: slugify(name) },
    { new: true }
  );


  // Se houver uma nova foto, lê o arquivo da foto e salva
  if (photo) {
    product.photo.data = fs.readFileSync(photo.path);
    product.photo.contentType = photo.type;
  }

  // Salva o produto atualizado e retorna como resposta
  await product.save();
  res.json(product);
};

// Serviço para filtrar produtos por categorias e faixa de preço
export const filteredProductsService = async (req, res) => {
  const { checked, radio } = req.body;

  let args = {};
  if (checked.length > 0) args.category = checked; // Filtra por categoria.
  if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] }; // Filtra pela faixa de preço.

  const products = await Product.find(args);
  res.json(products); // Retorna os produtos filtrados.
};

// Serviço para contar o número total de produtos
export const productsCountService = async (req, res) => {
  const total = await Product.find({}).estimatedDocumentCount();
  res.json(total); // Retorna o total de produtos no banco de dados.
};

// Serviço para listar produtos com paginação
export const listPaginatedProductsService = async (req, res) => {
  const perPage = 6; // Define o número de produtos por página.
  const page = req.params.page ? req.params.page : 1; // Define a página atual.

  const products = await Product.find({})
    .select("-photo")
    .skip((page - 1) * perPage)
    .limit(perPage)
    .sort({ createdAt: -1 }); // Ordena pela data de criação.

  res.json(products);
};

// Serviço para buscar produtos com base em uma palavra-chave
export const productsSearchService = async (req, res) => {
  const { keyword } = req.params;
  const results = await Product.find({
    $or: [{ name: { $regex: keyword, $options: "i" } }, { description: { $regex: keyword, $options: "i" } }],
  }).select("-photo");

  res.json(results); // Retorna os produtos que correspondem à pesquisa.
};

// Serviço para listar produtos relacionados com base na categoria
export const relatedProductsService = async (req, res) => {
  const { productId, categoryId } = req.params;
  const related = await Product.find({
    category: categoryId,
    _id: { $ne: productId }, // Exclui o próprio produto da lista.
  })
    .select("-photo")
    .populate("category")
    .limit(3); // Limita a três produtos relacionados.

  res.json(related);
};

// Serviço para gerar um token de pagamento com o Braintree
export const getTokenService = async (req, res) => {
  gateway.clientToken.generate({}, function (err, response) {
    if (err) {
      res.status(500).send(err); // Retorna erro se não for possível gerar o token.
    } else {
      res.send(response); // Retorna o token de pagamento.
    }
  });
};