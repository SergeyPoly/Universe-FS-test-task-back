export class GithubDataDto {
  owner: { login: string };
  name: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: Date;
}
