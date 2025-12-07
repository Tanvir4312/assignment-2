import { pool } from "../../config/db";

//create Bookings
const createBookings = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  //   get single vehicle by id
  const getSpecificVehicle = await pool.query(
    `
    SELECT * FROM vehicles WHERE id = $1
    `,
    [vehicle_id]
  );
  const vehicleData = getSpecificVehicle.rows[0];

  if (!vehicleData) {
    throw new Error("Vehicle not found");
  }

  if (vehicleData.availability_status !== "available") {
    throw new Error("Vehicle not available");
  }

  const startDate = new Date(rent_start_date as string);
  const endDate = new Date(rent_end_date as string);
  const differeceTime = endDate.getTime() - startDate.getTime();
  const duration = differeceTime / (1000 * 60 * 60 * 24);
  const dailtRentPrice = vehicleData.daily_rent_price;
  const total_price = dailtRentPrice * duration;

  let status = "active";

  const result = await pool.query(
    `
    INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price,status) VALUES($1,$2,$3,$4,$5,$6) RETURNING *
    `,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      status,
    ]
  );

  //   update vehicle
  await pool.query(
    `
   UPDATE vehicles SET availability_status=$1 WHERE id=$2
    `,
    ["booked", vehicle_id]
  );

  const vehicle = {
    vehicle_name: vehicleData.vehicle_name,
    daily_rent_price: vehicleData.daily_rent_price,
  };
  const response = {
    ...result.rows[0],
    vehicle,
  };

  return response;
};

// get All Bookings
const getAllBooking = async (role: string, id: string) => {
  if (role === "admin") {
    const result = await pool.query(`
        SELECT * FROM bookings
        `);
    return result;
  } else {
    const result = await pool.query(
      `
        SELECT * FROM bookings WHERE customer_id=$1
        `,
      [id]
    );

    const vehicle_id = result.rows[0].vehicle_id;
  

    //get specific vehicle table
    const vehicleTable = await pool.query(
      `
        SELECT * FROM vehicles WHERE id=$1
        `,
      [vehicle_id]
    );
    const vehicleData = vehicleTable.rows[0]
    const vehicle = {
      vehicle_name: vehicleData.vehicle_name,
      registration_number: vehicleData.registration_number,
      type: vehicleData.type,
    };
  
    const response = {
      ...result.rows[0],
      vehicle
    }

    return response;
  }
};

// update Bookings
const updateBooking = async (
  payload: Record<string, unknown>,
  id: string,
  userRole: string
) => {
  const {
    customer_id,
    vehicle_id,
    rent_start_date,
    rent_end_date,
    total_price,
    status,
  } = payload;

  const exist = await pool.query(
    `
    SELECT * FROM bookings WHERE id=$1
    `,
    [id]
  );

  const oldField = exist.rows[0];

  const customerId = customer_id ? customer_id : oldField.customer_id;
  const vehicleId = vehicle_id ? vehicle_id : oldField.vehicle_id;
  const rentStartDate = rent_start_date
    ? rent_start_date
    : oldField.rent_start_date;
  const rentEndDate = rent_end_date ? rent_end_date : oldField.rent_end_date;
  const totalPrice = total_price ? total_price : oldField.total_price;
  const updateStatus = status ? status : oldField.status;

  const date = new Date();
  const startDate = oldField.rent_start_date.toLocaleDateString();
  const periodEnd = oldField.rent_end_date.toLocaleDateString();
  const today = date.toLocaleDateString();

  if (userRole === "admin") {
    if (status === "returned") {
      //   update vehicle
      await pool.query(
        `
        UPDATE vehicles SET availability_status=$1 WHERE id=$2
    `,
        ["available", vehicleId]
      );
    }
  } else {
    throw new Error("Only admin booking status returned");
  }

  if (startDate === today) {
    throw new Error(" Cancel booking before Start date only");
  }

  if (today > periodEnd) {
    const result = await pool.query(
      `
        UPDATE bookings SET customer_id=$1, vehicle_id=$2, rent_start_date=$3, rent_end_date=$4, total_price=$5, status=$6 WHERE id=$7 RETURNING *
        `,
      [
        customerId,
        vehicleId,
        rentStartDate,
        rentEndDate,
        totalPrice,
        "returned",
        id,
      ]
    );

    //   update vehicle
    await pool.query(
      `
   UPDATE vehicles SET availability_status=$1 WHERE id=$2
    `,
      ["available", vehicleId]
    );

    return result;
  }

  const result = await pool.query(
    `
        UPDATE bookings SET customer_id=$1, vehicle_id=$2, rent_start_date=$3, rent_end_date=$4, total_price=$5, status=$6 WHERE id=$7 RETURNING *
        `,
    [
      customerId,
      vehicleId,
      rentStartDate,
      rentEndDate,
      totalPrice,
      updateStatus,
      id,
    ]
  );
  return result;
};

export const bookingsServices = {
  createBookings,
  getAllBooking,
  updateBooking,
};
