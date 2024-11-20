import express from "express";
const router = express.Router();

import { requireSignin, isAdmin } from "../middlewares/auth.js";

import {
  register,
  login,
  secret,
  updateProfile,
} from "../controllers/userController.js";

router.post("/register", register);

router.post("/login", login);

router.get("/auth-check", requireSignin, (req, res) => {
  res.json({ ok: true });
});

router.get("/admin-check", requireSignin, isAdmin, (req, res) => {
  res.json({ ok: true });
});

router.put("/profile", requireSignin, updateProfile);

router.get("/secret", requireSignin, isAdmin, secret);

export default router;
