import { type User, type InsertUser, type ContactMessage, type InsertContactMessage, type GitHubProject, type InsertGitHubProject } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  
  getGitHubProjects(): Promise<GitHubProject[]>;
  createGitHubProject(project: InsertGitHubProject): Promise<GitHubProject>;
  updateGitHubProject(githubId: string, project: Partial<InsertGitHubProject>): Promise<GitHubProject | undefined>;
  getGitHubProjectByGithubId(githubId: string): Promise<GitHubProject | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contactMessages: Map<string, ContactMessage>;
  private githubProjects: Map<string, GitHubProject>;

  constructor() {
    this.users = new Map();
    this.contactMessages = new Map();
    this.githubProjects = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = randomUUID();
    const message: ContactMessage = {
      ...insertMessage,
      id,
      createdAt: new Date(),
    };
    this.contactMessages.set(id, message);
    return message;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
  }

  async getGitHubProjects(): Promise<GitHubProject[]> {
    return Array.from(this.githubProjects.values())
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async createGitHubProject(insertProject: InsertGitHubProject): Promise<GitHubProject> {
    const id = randomUUID();
    const project: GitHubProject = {
      id,
      githubId: insertProject.githubId,
      name: insertProject.name,
      description: insertProject.description || null,
      htmlUrl: insertProject.htmlUrl,
      language: insertProject.language || null,
      topics: (insertProject.topics as string[] | null) || null,
      stargazersCount: insertProject.stargazersCount || null,
      forksCount: insertProject.forksCount || null,
      updatedAt: insertProject.updatedAt,
      createdAt: new Date(),
    };
    this.githubProjects.set(id, project);
    return project;
  }

  async updateGitHubProject(githubId: string, updates: Partial<InsertGitHubProject>): Promise<GitHubProject | undefined> {
    const existing = Array.from(this.githubProjects.values()).find(p => p.githubId === githubId);
    if (existing) {
      const updated: GitHubProject = {
        ...existing,
        ...updates,
        description: updates.description !== undefined ? updates.description || null : existing.description,
        language: updates.language !== undefined ? updates.language || null : existing.language,
        topics: updates.topics !== undefined ? (updates.topics as string[] | null) || null : existing.topics,
        stargazersCount: updates.stargazersCount !== undefined ? updates.stargazersCount || null : existing.stargazersCount,
        forksCount: updates.forksCount !== undefined ? updates.forksCount || null : existing.forksCount,
      };
      this.githubProjects.set(existing.id, updated);
      return updated;
    }
    return undefined;
  }

  async getGitHubProjectByGithubId(githubId: string): Promise<GitHubProject | undefined> {
    return Array.from(this.githubProjects.values()).find(p => p.githubId === githubId);
  }
}

export const storage = new MemStorage();
