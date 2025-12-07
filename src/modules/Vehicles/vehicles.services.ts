import { pool } from "../../config/db";

//Create Vehicle
const createVehicle = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const result = await pool.query(
    `
         INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1,$2,$3,$4,$5) RETURNING *
        `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  return result;
};

//Get All Vehicle
const getAllVehicle = async () => {
  const result = await pool.query(
    `
         SELECT * FROM vehicles
        `
  );

  return result;
};

//Get Single Vehicle
const getSingleVehicle = async (id: string) => {
  const result = await pool.query(
    `
         SELECT * FROM vehicles WHERE id = $1
        `,
    [id]
  );

  return result;
};

//Update Vehicle
const updateVehicle = async (
  vehicle_name: string,
  type: string,
  registration_number: string,
  daily_rent_price: number,
  availability_status: string,
  id: string
) => {
  const existing = await pool.query(
    `
        SELECT * FROM vehicles WHERE id=$1
        `,
    [id]
  );

  const oldField = existing.rows[0];

  const updateVehicle = vehicle_name ? vehicle_name : oldField.vehicle_name;
  const updateType = type ? type : oldField.type;
  const updateRegistration_number = registration_number
    ? registration_number
    : oldField.registration_number;
  const updateDaily_rent_price = daily_rent_price
    ? daily_rent_price
    : oldField.daily_rent_price;
  const updateAvailability_status = availability_status
    ? availability_status
    : oldField.availability_status;

  const result = await pool.query(
    `
         UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4,availability_status=$5 WHERE id=$6 RETURNING * 
        `,
    [
      updateVehicle,
      updateType,
      updateRegistration_number,
      updateDaily_rent_price,
      updateAvailability_status,
      id,
    ]
  );

  return result;
};

//Delete Vehicle
const deleteVehicle = async (id: string) => {

  
const bookingField = await pool.query(
    `
    SELECT * FROM bookings WHERE vehicle_id=$1
    `,
    [id]
  );

  if (bookingField.rows[0].status === "active") {
    throw new Error("Can't be deleted when the booking status is active!!");
  }

  const exist = await pool.query(
    `
        SELECT * FROM vehicles WHERE id=$1
        `,
    [id]
  );

  if (exist.rows[0].availability_status === "booked") {
    throw new Error(
      "This vehicle already booked. You cant't delete this at this moment!!"
    );
  }

  const result = await pool.query(
    `
        DELETE FROM vehicles WHERE id=$1
        `,
    [id]
  );

  return result;
};

export const vehicleServices = {
  createVehicle,
  getAllVehicle,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
