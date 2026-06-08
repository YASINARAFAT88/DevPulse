import bcrypt from "bcrypt";
import { pool } from "../../config/db";
import { SignupBody } from "./auth.types";
import { generateToken } from "../../utils/jwt";
import AppError from "../../utils/app.Error";

export const signupUser = async (
  payload: SignupBody
) => {
  const { name, email, password, role } = payload;

  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new AppError(
  "Email already exists",
  400
);
}

  const hashedPassword = await bcrypt.hash(
    password,
    10
  );

  const result = await pool.query(
    `
      INSERT INTO users
      (name,email,password,role)
      VALUES($1,$2,$3,$4)
      RETURNING
      id,
      name,
      email,
      role,
      created_at,
      updated_at
    `,
    [ name, email, hashedPassword, role, ]
  );

  return result.rows[0];
};

export const loginUser = async (
  email: string,
  password: string
) => {
  const userResult = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (userResult.rows.length === 0) {
    throw new AppError(
  "Invalid credentials",
  401
)};

  const user = userResult.rows[0];

  const matched = await bcrypt.compare(
    password,
    user.password
  );

  if (!matched) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = generateToken({
    id: user.id,
    name: user.name,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
  };
};