import express from "express";
const router = express.Router();

import { requireSignin, isAdmin } from "../middlewares/auth.js";

import {
  getUserOrders,
  getAllOrders,
  processPayment,
  orderStatus,
} from "../controllers/orderController.js";

router.get("/orders", requireSignin, getUserOrders);
router.get("/all-orders", requireSignin, isAdmin, getAllOrders);
router.post("/braintree/payment", requireSignin, processPayment);
router.put("/order-status/:orderId", requireSignin, isAdmin, orderStatus);

export default router;
