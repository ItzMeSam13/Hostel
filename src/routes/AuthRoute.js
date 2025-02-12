import { Router } from "express";
import { create_user } from "../controllers/Auth.js";
import { login_user } from "../controllers/Auth.js";

const router = Router();

router.post("/", create_user);
router.post("/login", login_user);

export default router;
