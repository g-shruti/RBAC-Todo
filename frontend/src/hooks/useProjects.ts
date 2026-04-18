import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "../constants/queryKeys";
import { projectService } from "../services/project.service";
import { CreateProjectInput } from "../types/project";

export const useProjects = () => {
  const queryClient = useQueryClient();

  const projectsQuery = useQuery({
    queryKey: QUERY_KEYS.projects,
    queryFn: projectService.getProjects,
  });

  const createProjectMutation = useMutation({
    mutationFn: (payload: CreateProjectInput) => projectService.createProject(payload),
    onSuccess: (project) => {
      queryClient.setQueryData(QUERY_KEYS.projects, (current: typeof projectsQuery.data = []) => [
        project,
        ...(current ?? []),
      ]);
    },
  });

  return {
    projects: projectsQuery.data ?? [],
    isLoading: projectsQuery.isLoading,
    isError: projectsQuery.isError,
    error: projectsQuery.error,
    refetch: projectsQuery.refetch,
    createProject: createProjectMutation.mutateAsync,
    isCreatingProject: createProjectMutation.isPending,
  };
};
