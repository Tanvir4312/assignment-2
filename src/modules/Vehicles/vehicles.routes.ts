import { Router } from "express";
import { vehiclesController } from "./vehicles.controller";
import auth from "../../middleware/auth";
import { userRoles } from "../auth/auth.constrant";

const router = Router();

//post vehicles
router.post("/", auth(userRoles.admin), vehiclesController.createVehicle);

//get all vehicles
router.get("/", vehiclesController.getAllVehicle);

//get single vehicles
router.get("/:vehicleId", vehiclesController.getSingleVehicle);

//Update vehicles
router.put(
  "/:vehicleId",
  auth(userRoles.admin),
  vehiclesController.updateVehicle
);

//Delete vehicles
router.delete(
  "/:vehicleId",
  auth(userRoles.admin),
  vehiclesController.deleteVehicle
);

export const vehiclesRouter = router;
