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