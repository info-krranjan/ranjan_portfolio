import { useQuery } from "@tanstack/react-query";
import { GitHubProject } from "@shared/schema";

export function useGitHubProjects() {
  return useQuery<GitHubProject[]>({
    queryKey: ["/api/github/projects"],
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  });
}

export function useSyncGitHubProjects() {
  return useQuery<{ message: string; count: number; projects: GitHubProject[] }>({
    queryKey: ["/api/github/projects/sync"],
    enabled: false, // Only run when manually triggered
  });
}
