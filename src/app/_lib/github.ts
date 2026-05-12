type GitHubLabel = {
  name: string;
};

type GitHubUser = {
  login: string;
  html_url: string;
};

export type GitHubIssue = {
  number: number;
  title: string;
  state: 'open' | 'closed';
  html_url: string;
  created_at: string;
  updated_at: string;
  body: string | null;
  user: GitHubUser | null;
  labels: GitHubLabel[];
  comments: number;
  pull_request?: unknown;
};

export type GitHubIssueComment = {
  id: number;
  html_url: string;
  created_at: string;
  updated_at: string;
  body: string | null;
  user: GitHubUser | null;
};

const OWNER = 'amah853';
const REPO = 'status.stafflyt.com';
const API_BASE = `https://api.github.com/repos/${OWNER}/${REPO}`;

function buildGitHubHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
  };

  // Optional: increases GitHub API rate limits.
  // Safe here because this module is only used in Server Components.
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  return headers;
}

function isPullRequest(issue: GitHubIssue): boolean {
  return typeof issue.pull_request !== 'undefined';
}

export async function fetchRecentIssues(options?: {
  limit?: number;
  revalidateSeconds?: number;
}): Promise<GitHubIssue[]> {
  const limit = options?.limit ?? 25;
  const revalidateSeconds = options?.revalidateSeconds ?? 60;

  const url = new URL(`${API_BASE}/issues`);
  url.searchParams.set('state', 'all');
  url.searchParams.set('sort', 'updated');
  url.searchParams.set('direction', 'desc');
  url.searchParams.set('per_page', String(Math.min(Math.max(limit, 1), 100)));

  const res = await fetch(url.toString(), {
    headers: buildGitHubHeaders(),
    next: { revalidate: revalidateSeconds },
  });

  if (!res.ok) {
    console.error('GitHub issues fetch failed', res.status, await res.text());
    return [];
  }

  const items = (await res.json()) as GitHubIssue[];
  return items.filter((i) => !isPullRequest(i));
}

export async function fetchIssue(issueNumber: number, options?: { revalidateSeconds?: number }): Promise<GitHubIssue | null> {
  const revalidateSeconds = options?.revalidateSeconds ?? 60;

  const res = await fetch(`${API_BASE}/issues/${issueNumber}`, {
    headers: buildGitHubHeaders(),
    next: { revalidate: revalidateSeconds },
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    console.error('GitHub issue fetch failed', res.status, await res.text());
    return null;
  }

  const issue = (await res.json()) as GitHubIssue;
  if (isPullRequest(issue)) return null;
  return issue;
}

export async function fetchIssueComments(issueNumber: number, options?: { revalidateSeconds?: number }): Promise<GitHubIssueComment[]> {
  const revalidateSeconds = options?.revalidateSeconds ?? 60;

  const url = new URL(`${API_BASE}/issues/${issueNumber}/comments`);
  url.searchParams.set('per_page', '100');

  const res = await fetch(url.toString(), {
    headers: buildGitHubHeaders(),
    next: { revalidate: revalidateSeconds },
  });

  if (!res.ok) {
    console.error('GitHub issue comments fetch failed', res.status, await res.text());
    return [];
  }

  return (await res.json()) as GitHubIssueComment[];
}
