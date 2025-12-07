import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router()

//Singup
router.post("/signup", authController.createUserAuth)

//login
router.post("/signin", authController.userSignin)

export const authRouter = router