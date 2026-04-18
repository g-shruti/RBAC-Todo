export const ROUTES = {
  login: "/login",
  signup: "/signup",
  dashboard: "/",
  project: (projectId: string) => `/projects/${projectId}`,
} as const;
