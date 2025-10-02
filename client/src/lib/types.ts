export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  created_at: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SkillItem {
  name: string;
  percentage: number;
  color: string;
}

export interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  description: string;
  type: 'education' | 'experience';
  color: string;
}
