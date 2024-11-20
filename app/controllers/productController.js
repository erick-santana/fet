import {
  createProductService,
  listProductsService,
  readProductService,
  productPhotoService,
  removeProductService,
  updateProductService,
  filteredProductsService,
  productsCountService,
  listPaginatedProductsService,
  productsSearchService,
  relatedProductsService,
  getTokenService,
} from "../services/productService.js";


export const create = async (req, res) => {
  try {
    await createProductService(req, res);
  } catch (err) {
    console.log(err);
  }
};


export const list = async (req, res) => {
  try {
    await listProductsService(req, res);
  } catch (err) {
    console.log(err);
  }
};


export const read = async (req, res) => {
  try {
    await readProductService(req, res);
  } catch (err) {
    console.log(err);
  }
};

export const photo = async (req, res) => {
  try {
    await productPhotoService(req, res);
  } catch (err) {
    console.log(err);
  }
};


export const remove = async (req, res) => {
  try {
    await removeProductService(req, res);
  } catch (err) {
    console.log(err);
  }
};


export const update = async (req, res) => {
  try {
    await updateProductService(req, res);
  } catch (err) {
    console.log(err);
  }
};


export const filteredProducts = async (req, res) => {
  try {
    await filteredProductsService(req, res);
  } catch (err) {
    console.log(err);
  }
};

export const productsCount = async (req, res) => {
  try {
    await productsCountService(req, res);
  } catch (err) {
    console.log(err);
  }
};


export const listProducts = async (req, res) => {
  try {
    await listPaginatedProductsService(req, res);
  } catch (err) {
    console.log(err);
  }
};


export const productsSearch = async (req, res) => {
  try {
    await productsSearchService(req, res);
  } catch (err) {
    console.log(err);
  }
};


export const relatedProducts = async (req, res) => {
  try {
    await relatedProductsService(req, res);
  } catch (err) {
    console.log(err);
  }
};


export const getToken = async (req, res) => {
  try {
    await getTokenService(req, res);
  } catch (err) {
    console.log(err);
  }
};