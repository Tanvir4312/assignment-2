import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import jwt from "jsonwebtoken";
import config from "../../config";

//Create User
const createUserAuth = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  const hashedPass = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `
    INSERT INTO users(name, email, password, phone, role) VALUES($1,$2,$3,$4,$5) RETURNING id,name,email,phone,role
    `,
    [name, email, hashedPass, phone, role]
  );

  return result;
};

//User Login
const userSignin = async (payload: Record<string, unknown>) => {
  const { email, password } = payload;

  const result = await pool.query(
    `
  SELECT * FROM users WHERE email=$1
  `,
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error("User not found!!");
  }

  const user = result.rows[0];

  const match = await bcrypt.compare(password as string, user.password);

  if (!match) {
    throw new Error("Invalid credential!!");
  }

  const jsonPayload = {
    id:user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  //create jwt
  const token = jwt.sign(jsonPayload, config.jwt_secret as string, {
    expiresIn: "20d",
  });
  return {token, result };
};

export const authServices = {
  createUserAuth,
  userSignin,
};
