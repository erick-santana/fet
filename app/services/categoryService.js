import Category from "../models/category.js";
import Product from "../models/product.js";
import slugify from "slugify";

export const createCategoryService = async (req, res) => {
  const { name } = req.body;
  if (!name.trim()) {
    return res.json({ error: "O nome é obrigatório" });
  }
  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    return res.json({ error: "Essa categoria já existe" });
  }

  const category = await new Category({ name, slug: slugify(name) }).save();
  res.json(category);
};

export const updateCategoryService = async (req, res) => {
  const { name } = req.body;
  const { categoryId } = req.params;
  
  const category = await Category.findByIdAndUpdate(
    categoryId,
    {
      name,
      slug: slugify(name),
    },
    { new: true }
  );
  res.json(category);
};

export const removeCategoryService = async (req, res) => {
  const removed = await Category.findByIdAndDelete(req.params.categoryId);
  res.json(removed);
};

export const listCategoryService = async (req, res) => {
  const all = await Category.find({});
  res.json(all);
};

export const readCategoryService = async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  res.json(category);
};

export const productsByCategoryService = async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  const products = await Product.find({ category }).populate("category");

  res.json({
    category,
    products,
  });
};
