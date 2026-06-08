import jwt from "jsonwebtoken";
import { env } from "../config/env";

interface JwtPayload {
  id: number;
  name: string;
  role: string;
}

export const generateToken = (payload: JwtPayload) => {
  return jwt.sign(
    payload,
    env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );
};