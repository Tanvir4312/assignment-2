import { Request, Response } from "express";
import { authServices } from "./auth.services";

//singup
const createUserAuth = async (req: Request, res: Response) => {
  const { role, password } = req.body;

  if (password.length < 6) {
    return res.status(500).json({
      message: "Password character must be atleast 6",
    });
  }

  if (!["admin", "customer"].includes(role)) {
    return res.status(500).json({
      message: "Valid User role must be provided.",
    });
  }

  try {
    const result = await authServices.createUserAuth(req.body);

    res.status(201).json({
      succecc: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      succecc: false,
      message: err.message,
    });
  }
};

//signin
const userSignin = async (req: Request, res: Response) => {
  try {
    const result = await authServices.userSignin(req.body);
    res.status(200).json({
      success: true,
      message: "User Sigin",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const authController = {
  createUserAuth,
  userSignin,
};
