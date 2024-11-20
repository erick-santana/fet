import mongoose from "mongoose"; 
const { ObjectId } = mongoose.Schema; 

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String, 
      trim: true, 
      required: true, 
      maxlength: 160, 
    },

    // slug do produto
    slug: {
      type: String, 
      lowercase: true, 
    },

    description: {
      type: {}, 
      required: true, 
      maxlength: 2000, 
    },

    price: {
      type: Number, 
      trim: true, 
      required: true, 
    },

    category: {
      type: ObjectId, 
      ref: "Category", 
      required: true, 
    },

    // Quantidade disponível em estoque.
    quantity: {
      type: Number, 
    },

    sold: {
      type: Number, 
      default: 0, 
    },

    photo: {
      data: Buffer, 
      contentType: String, 
    },

    // Informação sobre a possibilidade de envio do produto.
    shipping: {
      required: false, 
      type: Boolean, 
    },
  },
  { timestamps: true } 
);

export default mongoose.model("Product", productSchema);
