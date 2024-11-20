import User from "../models/user.js";
import { hashPassword, comparePassword } from "../helpers/auth.js";
import jwt from "jsonwebtoken";

export const registerUserService = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name.trim()) {
    return res.json({ error: "Nome é obrigatório" });
  }
  if (!email) {
    return res.json({ error: "Email já foi registrado" });
  }
  if (!password || password.length < 6) {
    return res.json({ error: "A senha deve ter no mínimo 6 caracteres" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.json({ error: "Email já foi registrado" });
  }

  const hashedPassword = await hashPassword(password);

  const user = await new User({
    name,
    email,
    password: hashedPassword,
  }).save();

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
    },
    token,
  });
};

export const loginUserService = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.json({ error: "Email é obrigatório" });
  }
  if (!password || password.length < 6) {
    return res.json({ error: "A senha deve ter no mínimo 6 caracteres" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ error: "Usuário não encontrado" });
  }

  const match = await comparePassword(password, user.password);
  if (!match) {
    return res.json({ error: "Senha incorreta" });
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
    },
    token,
  });
};

export const secretUserService = async (req, res) => {
  res.json({ currentUser: req.user });
};

export const updateUserProfileService = async (req, res) => {
  const { name, password, address } = req.body;

  const user = await User.findById(req.user._id);

  if (password && password.length < 6) {
    return res.json({
      error: "A senha deve ter no mínimo 6 caracteres",
    });
  }

  const hashedPassword = password ? await hashPassword(password) : undefined;

  const updated = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: name || user.name,
      password: hashedPassword || user.password,
      address: address || user.address,
    },
    { new: true }
  );

  updated.password = undefined;

  res.json(updated);
};
