import { pool } from "../../config/db";

//get all user
const getAllUser = async () => {
  const result = await pool.query(`
        SELECT id,name,email,phone,role FROM users

         `);

  return result;
};

//update user
const updateUser = async (
  payload: Record<string, unknown>,
  id: string,
  userRole: string,
  userEmail: string
) => {
  const { name, email, phone, role } = payload;

  const exist = await pool.query(
    `
    SELECT * FROM users WHERE id=$1
    `,
    [id]
  );

  const oldField = exist.rows[0];

  const updateName = name ? name : oldField.name;
  const updateEmail = email ? email : oldField.email;
  const updatePhone = phone ? phone : oldField.phone;
  const updateRole = role ? role : oldField.role;

  if (userRole !== "admin") {
    if (userEmail !== updateEmail) {
      throw new Error("Unauthorized!!");
    }
  }

  if (userRole === "customer") {
    const result = await pool.query(
      `
       UPDATE users SET name=$1, email=$2, phone=$3 WHERE id=$4 RETURNING id,name,email,phone

         `,
      [updateName, updateEmail, updatePhone, id]
    );
    return result;
  }
  if (userRole === "admin") {
    const result = await pool.query(
      `
       UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING id,name,email,phone,role

         `,
      [updateName, updateEmail, updatePhone, updateRole, id]
    );
    return result;
  }

  const result = await pool.query(
    `
       UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING id,name,email,phone,role

         `,
    [updateName, updateEmail, updatePhone, updateRole, id]
  );

  return result;
};

//delete user
const deleteUser = async (id: string) => {
  const bookingField = await pool.query(
    `
    SELECT * FROM bookings WHERE customer_id=$1
    `,
    [id]
  );

  if (bookingField.rows[0].status === "active") {
    throw new Error("Can't be deleted when the booking status is active!!");
  }

  const result = await pool.query(
    `
        DELETE FROM users WHERE id=$1
         `,
    [id]
  );

  return result;
};

export const userServices = {
  getAllUser,
  updateUser,
  deleteUser,
};
