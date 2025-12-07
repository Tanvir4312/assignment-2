import { Request, Response } from "express";
import { vehicleServices } from "./vehicles.services";
import { pool } from "../../config/db";

// Create Vehicle
const createVehicle = async (req: Request, res: Response) => {
  const { type, daily_rent_price, availability_status } = req.body;
  if (!["car", "bike", "van", "SUV"].includes(type)) {
    return res.status(500).json({
      message: "Invalid vehicle type",
    });
  }
  if (daily_rent_price <= 0) {
    return res.status(500).json({
      message: "Price must be valid",
    });
  }
  if (!["booked", "available"].includes(availability_status)) {
    return res.status(500).json({
      message: "Status Invalid",
    });
  }
  try {
    const result = await vehicleServices.createVehicle(req.body);
    res.status(201).json({
      succecc: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      succecc: false,
      message: err.message,
    });
  }
};

// get all Vehicle
const getAllVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getAllVehicle();

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        message: "No vehicles found",
        data: result.rows,
      });
    }

    res.status(200).json({
      succecc: true,
      message: "Vehicles retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      succecc: false,
      message: err.message,
    });
  }
};

// get Vehicle by id
const getSingleVehicle = async (req: Request, res: Response) => {
  const vehicleId = req.params.vehicleId;
  try {
    const result = await vehicleServices.getSingleVehicle(vehicleId as string);

    if (result.rows.length === 0) {
      throw new Error("Vehicle not found!!");
    }

    res.status(200).json({
      succecc: true,
      message: "Vehicle retrieved successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      succecc: false,
      message: err.message,
    });
  }
};

// Update Vehicle
const updateVehicle = async (req: Request, res: Response) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = req.body;
  const vehicleId = req.params.vehicleId;
  try {
    const result = await vehicleServices.updateVehicle(
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      vehicleId as string
    );
    res.status(200).json({
      succecc: true,
      message: "Vehicle updated successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      succecc: false,
      message: err.message,
    });
  }
};

// Delete Vehicle
const deleteVehicle = async (req: Request, res: Response) => {
  const vehicleId = req.params.vehicleId;

  try {
    await vehicleServices.deleteVehicle(vehicleId as string);
    res.status(200).json({
      succecc: true,
      message: "Vehicle deleted successfully",
    });
  } catch (err: any) {
    res.status(500).json({
      succecc: false,
      message: err.message,
    });
  }
};

export const vehiclesController = {
  createVehicle,
  getAllVehicle,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
