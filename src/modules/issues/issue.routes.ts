import { Router } from "express";

import auth from "../../middleware/auth.middleware";

import {
  createIssueController,
  getAllIssuesController,
  getSingleIssueController,
} from "./issue.controller";



const router = Router();

router.post("/", auth, createIssueController);

router.get("/", getAllIssuesController);

router.get( "/:id", getSingleIssueController );



export default router;