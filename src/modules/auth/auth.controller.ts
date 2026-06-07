import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/response";

import {
  signupUser,
  loginUser,
} from "./auth.service";

export const signup = catchAsync(
  async (req: Request, res: Response) => {
    const result = await signupUser(req.body);

    sendResponse(
      res,
      StatusCodes.CREATED,
      {
        success: true,
        message:
          "User registered successfully",
        data: result,
      }
    );
  }
);

export const login = catchAsync(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const result = await loginUser(
      email,
      password
    );

    sendResponse(
      res,
      StatusCodes.OK,
      {
        success: true,
        message: "Login successful",
        data: result,
      }
    );
  }
);

