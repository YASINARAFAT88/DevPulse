import { Router } from "express";

import auth from "../../middleware/auth.middleware";

import {
  createIssueController,
  getAllIssuesController,
} from "./issue.controller";



const router = Router();

router.post("/", auth, createIssueController);

router.get("/", getAllIssuesController);

export default router;