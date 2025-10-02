import { Octokit } from '@octokit/rest'
import { storage } from './storage';
import { GitHubProject, InsertGitHubProject } from '@shared/schema';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
// Always call this function again to get a fresh client.
export async function getUncachableGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

export async function getGitHubProjects(): Promise<Omit<GitHubProject, 'id' | 'createdAt'>[]> {
  try {
    const octokit = await getUncachableGitHubClient();
    const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 20,
      affiliation: 'owner'
    });

    return repos.map(repo => ({
      githubId: repo.id.toString(),
      name: repo.name,
      description: repo.description || null,
      htmlUrl: repo.html_url,
      language: repo.language || null,
      topics: repo.topics || null,
      stargazersCount: repo.stargazers_count.toString(),
      forksCount: repo.forks_count.toString(),
      updatedAt: new Date(repo.updated_at || repo.created_at || Date.now()),
    }));
  } catch (error) {
    console.error('Error fetching GitHub projects:', error);
    throw new Error('Failed to fetch GitHub projects');
  }
}

export async function syncGitHubProjects(): Promise<GitHubProject[]> {
  try {
    const githubProjects = await getGitHubProjects();
    const syncedProjects: GitHubProject[] = [];

    for (const project of githubProjects) {
      const existing = await storage.getGitHubProjectByGithubId(project.githubId);
      
      if (existing) {
        // Update existing project
        const updated = await storage.updateGitHubProject(project.githubId, {
          name: project.name,
          description: project.description,
          htmlUrl: project.htmlUrl,
          language: project.language,
          topics: project.topics,
          stargazersCount: project.stargazersCount,
          forksCount: project.forksCount,
          updatedAt: project.updatedAt,
        });
        if (updated) {
          syncedProjects.push(updated);
        }
      } else {
        // Create new project
        const insertProject: InsertGitHubProject = {
          githubId: project.githubId,
          name: project.name,
          description: project.description,
          htmlUrl: project.htmlUrl,
          language: project.language,
          topics: project.topics,
          stargazersCount: project.stargazersCount,
          forksCount: project.forksCount,
          updatedAt: project.updatedAt,
        };
        const created = await storage.createGitHubProject(insertProject);
        syncedProjects.push(created);
      }
    }

    console.log(`Synced ${syncedProjects.length} GitHub projects`);
    return syncedProjects;
  } catch (error) {
    console.error('Error syncing GitHub projects:', error);
    throw new Error('Failed to sync GitHub projects');
  }
}
