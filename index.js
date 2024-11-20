import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import userRoutes from "./app/routes/userRoutes.js";
import categoryRoutes from "./app/routes/categoryRoutes.js";
import productRoutes from "./app/routes/productRoutes.js";
import orderRoutes from "./app/routes/orderRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log("DB ERROR => ", err));


app.use(cors());
app.use(morgan("dev"));
app.use(express.json());


app.use("/", userRoutes);
app.use("/", categoryRoutes);
app.use("/", productRoutes);
app.use("/", orderRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Fraga esse tempero na porta ${port}`);
});
