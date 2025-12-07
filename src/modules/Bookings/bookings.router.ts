import { Router } from "express";
import { bookingsController } from "./bookings.controller";
import auth from "../../middleware/auth";
import { userRoles } from "../auth/auth.constrant";

const router = Router();

//Bookings post
router.post(
  "/",
  auth(userRoles.admin, userRoles.customer),
  bookingsController.createBookings
);

//Get all bokkings
router.get("/",  auth(), bookingsController.getAllBookings);

//update bookings
router.put(
  "/:bookingId",
  auth(userRoles.admin, userRoles.customer),
  bookingsController.updateBookings
);

export const bookingsRouter = router;
