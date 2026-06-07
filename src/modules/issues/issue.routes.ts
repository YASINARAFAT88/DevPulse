import { Router } from "express";

import auth from "../../middleware/auth.middleware";

import {
  createIssueController,
} from "./issue.controller";

const router = Router();

router.post(
  "/",
  auth,
  createIssueController
);

export default router;