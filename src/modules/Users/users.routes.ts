import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import { userRoles } from "../auth/auth.constrant";

const route = Router();

//ger all user
route.get("/", auth(userRoles.admin), userController.getAllUser);

//update user
route.put("/:userId", auth(), userController.updateUser);

//delete user
route.delete("/:userId", auth(userRoles.admin), userController.deleteUser);

export const userRouter = route;
