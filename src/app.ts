import express from "express";
import { authRouter } from "./modules/auth/auth.routes";
import { vehiclesRouter } from "./modules/Vehicles/vehicles.routes";
import { userRouter } from "./modules/Users/users.routes";
import { bookingsRouter } from "./modules/Bookings/bookings.router";

const app = express();

//perser
app.use(express.json());

//auth
app.use("/api/v1/auth", authRouter)

//Vehicles
app.use("/api/v1/vehicles", vehiclesRouter)

//Users
app.use("/api/v1/users", userRouter)

//Bookings
app.use("/api/v1/bookings", bookingsRouter)

export default app