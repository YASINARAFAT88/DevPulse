export interface CreateIssueBody {
  title: string;
  description: string;
  type: "bug" | "feature_request";
}