import { Router } from "express";

import auth from "../../middleware/auth.middleware";

import authorize from "../../middleware/role.middleware";

import {
  createIssueController,
  deleteIssueController,
  getAllIssuesController,
  getSingleIssueController,
  updateIssueController,
} from "./issue.controller";




const router = Router();

router.post("/", auth, createIssueController);

router.get("/", getAllIssuesController);

router.get( "/:id", getSingleIssueController );

router.patch( "/:id", auth, updateIssueController );

router.delete( "/:id", auth, authorize("maintainer"),
  deleteIssueController
);

export default router;