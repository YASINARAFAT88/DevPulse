import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/response";

import { createIssue } from "./issue.service";
import { getAllIssues } from "./issue.service";
import { getSingleIssue } from "./issue.service";

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

export const getAllIssuesController =
  catchAsync(
    async (
      req: Request,
      res: Response
    ) => {
      const {
        sort,
        type,
        status,
      } = req.query;

      const result =
        await getAllIssues(
          sort as string,
          type as string,
          status as string
        );

      sendResponse(
        res,
        200,
        {
          success: true,
          message:
            "Issues retrieved successfully",
          data: result,
        }
      );
    }
  );

export const getSingleIssueController =
  catchAsync(
    async (
      req: Request,
      res: Response
    ) => {
      const result =
        await getSingleIssue(
          Number(req.params.id)
        );

      sendResponse(
        res,
        200,
        {
          success: true,
          message:
            "Issue retrieved successfully",
          data: result,
        }
      );
    }
  );