import { Response } from "express";

interface TResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
}

const sendResponse = <T>(
  res: Response,
  statusCode: number,
  payload: TResponse<T>
) => {
  res.status(statusCode).json(payload);
};

export default sendResponse;