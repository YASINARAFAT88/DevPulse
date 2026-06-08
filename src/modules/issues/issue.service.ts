import { pool } from "../../config/db";
import { CreateIssueBody } from "./issue.types";
import AppError from "../../utils/app.Error";

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

export const getAllIssues = async (
  sort?: string,
  type?: string,
  status?: string
) => {
  const conditions: string[] = [];
  const values: string[] = [];

  let query = `
    SELECT *
    FROM issues
  `;

  if (type) {
    values.push(type);
    conditions.push(
      `type = $${values.length}`
    );
  }

  if (status) {
    values.push(status);
    conditions.push(
      `status = $${values.length}`
    );
  }

  if (conditions.length > 0) {
    query += `
      WHERE ${conditions.join(" AND ")}
    `;
  }

  query += `
    ORDER BY created_at
    ${
      sort === "oldest"
        ? "ASC"
        : "DESC"
    }
  `;

  const issuesResult =
    await pool.query(
      query,
      values
    );

  const issues =
    issuesResult.rows;

  if (issues.length === 0) {
    return [];
  }

  const reporterIds = [
    ...new Set(
      issues.map(
        (issue) =>
          issue.reporter_id
      )
    ),
  ];

  const reportersResult =
    await pool.query(
      `
      SELECT id,name,role
      FROM users
      WHERE id = ANY($1)
      `,
      [reporterIds]
    );

  const reporters =
    reportersResult.rows;

  const reporterMap =
    new Map();

  reporters.forEach(
    (reporter) => {
      reporterMap.set(
        reporter.id,
        reporter
      );
    }
  );

  return issues.map((issue) => ({
    id: issue.id,
    title: issue.title,
    description:
      issue.description,
    type: issue.type,
    status: issue.status,

    reporter:
      reporterMap.get(
        issue.reporter_id
      ),

    created_at:
      issue.created_at,

    updated_at:
      issue.updated_at,
  }));
};

export const getSingleIssue = async (
  issueId: number
) => {
  const issueResult = await pool.query(
    `
      SELECT *
      FROM issues
      WHERE id = $1
    `,
    [issueId]
  );

  if (issueResult.rows.length === 0) {
    throw new Error("Issue not found");
  }

  const issue = issueResult.rows[0];

  const reporterResult = await pool.query(
    `
      SELECT
      id,
      name,
      role
      FROM users
      WHERE id = $1
    `,
    [issue.reporter_id]
  );

  const reporter =
    reporterResult.rows[0];

  return {
    id: issue.id,
    title: issue.title,
    description:
      issue.description,
    type: issue.type,
    status: issue.status,

    reporter,

    created_at:
      issue.created_at,

    updated_at:
      issue.updated_at,
  };
};

export const updateIssue = async (
  issueId: number,
  payload: {
    title?: string;
    description?: string;
    type?: string;
    status?: string;
  },
  user: {
    id: number;
    role: string;
  }
) => {
  const issueResult = await pool.query(
    `
    SELECT *
    FROM issues
    WHERE id = $1
    `,
    [issueId]
  );

  if (issueResult.rows.length === 0) {
    throw new AppError(
      "Issue not found",
      404
    );
  }

  const issue = issueResult.rows[0];

  // contributor rules

  if (user.role === "contributor") {
    if (issue.reporter_id !== user.id) {
      throw new AppError(
        "You can only update your own issues",
        403
      );
    }

    if (issue.status !== "open") {
      throw new AppError(
        "Open issues only can be edited",
        409
      );
    }

    // contributor cannot change status

    delete payload.status;
  }

  const updatedTitle =
    payload.title ?? issue.title;

  const updatedDescription =
    payload.description ??
    issue.description;

  const updatedType =
    payload.type ?? issue.type;

  const updatedStatus =
    payload.status ??
    issue.status;

  const result = await pool.query(
    `
    UPDATE issues
    SET
      title = $1,
      description = $2,
      type = $3,
      status = $4,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $5

    RETURNING *
    `,
    [
      updatedTitle,
      updatedDescription,
      updatedType,
      updatedStatus,
      issueId,
    ]
  );

  return result.rows[0];
};