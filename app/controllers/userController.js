import {
  registerUserService,
  loginUserService,
  secretUserService,
  updateUserProfileService,
} from "../services/userService.js";

export const register = async (req, res) => {
  try {
    await registerUserService(req, res);
  } catch (err) {
    console.log(err);
  }
};

export const login = async (req, res) => {
  try {
    await loginUserService(req, res);
  } catch (err) {
    console.log(err);
  }
};

export const secret = async (req, res) => {
  try {
    await secretUserService(req, res);
  } catch (err) {
    console.log(err);
  }
};

export const updateProfile = async (req, res) => {
  try {
    await updateUserProfileService(req, res);
  } catch (err) {
    console.log(err);
  }
};
