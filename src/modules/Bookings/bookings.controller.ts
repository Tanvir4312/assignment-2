import { Request, Response } from "express";
import { bookingsServices } from "./booking.services";

// create bookings
const createBookings = async (req: Request, res: Response) => {
  try {
    const result = await bookingsServices.createBookings(req.body);

    res.status(201).json({
      succecc: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// get all bookings
const getAllBookings = async (req: Request, res: Response) => {
  const role = req.user!.role

  const userId = req.user!.id
  try {
    const result = await bookingsServices.getAllBooking(role, userId);

    if(role === 'admin'){
      res.status(200).json({
      succecc: true,
      message: "Bookings retrieved successfully",
      data: result.rows,
    });
    }

    res.status(200).json({
      succecc: true,
      message: "Bookings retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// update bookings
const updateBookings = async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId;
  const userRole = req.user!.role
  try {
    const result = await bookingsServices.updateBooking(
      req.body,
      bookingId as string,
      userRole
    );
    const status = result.rows[0].status;
    if (status === "returned") {
      return res.status(200).json({
        succecc: true,
        message: "Booking marked as returned. Vehicle is now available",
        data: result.rows[0],
      });
    }
    return res.status(200).json({
      succecc: true,
      message: "Bookings cancelled successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const bookingsController = {
  createBookings,
  getAllBookings,
  updateBookings,
};
