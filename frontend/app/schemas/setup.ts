import { z } from "zod";

export const githubSchema = z.object({
  username: z.string().min(1, "GitHub username is required"),
  token: z.string().min(1, "GitHub token is required").regex(/^gh[ps]_[A-Za-z0-9_]{36,255}$/, "Invalid GitHub token format"),
});

export const jiraSchema = z.object({
  url: z.string().url("Invalid Jira URL").optional().or(z.literal("")),
  username: z.string().email("Invalid email address").optional().or(z.literal("")),
  apiToken: z.string().optional().or(z.literal("")),
  projectKey: z.string().optional().or(z.literal("")),
});

export const aiModelSchema = z.object({
  name: z.string().optional().or(z.literal("")),
  token: z.string().optional().or(z.literal("")),
});

export const setupFormSchema = z.object({
  github: githubSchema,
  jira: jiraSchema,
  aiModel: aiModelSchema,
});

export type SetupFormData = z.infer<typeof setupFormSchema>;
export type GitHubData = z.infer<typeof githubSchema>;
export type JiraData = z.infer<typeof jiraSchema>;
export type AIModelData = z.infer<typeof aiModelSchema>;