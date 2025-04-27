import { Expose } from 'class-transformer';

export class ProjectDataDto {
  @Expose()
  ownerName: string;

  @Expose()
  repoName: string;

  @Expose()
  url: string;

  @Expose()
  stars: number;

  @Expose()
  forks: number;

  @Expose()
  issues: number;

  @Expose()
  repoCreatedAt: Date;
}
