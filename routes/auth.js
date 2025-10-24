import express from "express";
import {
  login,
  register,
  logout,
  registerBusiness,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/registerbusiness", registerBusiness);
router.post("/logout", logout);

export default router;
