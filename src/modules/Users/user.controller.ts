import { Request, Response } from "express";
import { userServices } from "./user.services";

//get all user
const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getAllUser();

    res.status(200).json({
      succecc: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      message: err.message,
    });
  }
};

//update user
const updateUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const role = req.user!.role;
  const email = req.user!.email;

  try {
    const result = await userServices.updateUser(
      req.body,
      userId as string,
      role,
      email
    );

    if (!result.rows[0].role) {
     return res.status(400).json({
        succecc: true,
        message: "Customer are not allowed to update their own role!!",
      
      });
    }

   return res.status(200).json({
      succecc: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      message: err.message,
    });
  }
};

//delete user
const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    await userServices.deleteUser(userId as string);

    res.status(200).json({
      succecc: true,
      message: "User deleted successfully",
    });
  } catch (err: any) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const userController = {
  getAllUser,
  updateUser,
  deleteUser,
};
