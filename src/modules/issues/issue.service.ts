import { pool } from "../../config/db";
import { CreateIssueBody } from "./issue.types";

export const createIssue = async (
  payload: CreateIssueBody,
  reporterId: number
) => {
  const { title, description, type } = payload;

  if (title.length > 150) {
    throw new Error(
      "Title cannot exceed 150 characters"
    );
  }

  if (description.length < 20) {
    throw new Error(
      "Description must be at least 20 characters"
    );
  }

  const result = await pool.query(
    `
      INSERT INTO issues
      (
        title,
        description,
        type,
        reporter_id
      )
      VALUES
      ($1,$2,$3,$4)

      RETURNING *
    `,
    [
      title,
      description,
      type,
      reporterId,
    ]
  );

  return result.rows[0];
};