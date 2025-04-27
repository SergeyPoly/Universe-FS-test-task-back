import { Expose } from 'class-transformer';

export class ProjectResponseDto {
  @Expose()
  id: string;

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
  repoCreatedAt: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
