import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/response";

import { createIssue } from "./issue.service";

export const createIssueController =
  catchAsync(
    async (
      req: Request,
      res: Response
    ) => {
      const result =
        await createIssue(
          req.body,
          req.user!.id
        );

      sendResponse(
        res,
        StatusCodes.CREATED,
        {
          success: true,
          message:
            "Issue created successfully",
          data: result,
        }
      );
    }
  );