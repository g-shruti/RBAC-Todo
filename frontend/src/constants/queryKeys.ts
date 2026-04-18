export const QUERY_KEYS = {
  authUser: ["auth", "me"] as const,
  projects: ["projects"] as const,
  board: (projectId: string) => ["projects", projectId, "board"] as const,
} as const;
