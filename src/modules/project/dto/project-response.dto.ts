import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ProjectResponseDto {
  @Expose()
  @ApiProperty({
    example: 'deafbeef-1234-5678-abcd-ef9876543210',
    description: 'Unique identifier for the project',
  })
  id: string;

  @Expose()
  @ApiProperty({
    example: 'SergeyPoly',
    description: 'Owner of the GitHub repository',
  })
  ownerName: string;

  @Expose()
  @ApiProperty({
    example: 'goit-markup-final-project',
    description: 'Repository name on GitHub',
  })
  repoName: string;

  @Expose()
  @ApiProperty({
    example: 'https://github.com/SergeyPoly/goit-markup-final-project',
    description: 'URL to the GitHub repository',
  })
  url: string;

  @Expose()
  @ApiProperty({
    example: 3,
    description: 'Number of stars the repository has',
  })
  stars: number;

  @Expose()
  @ApiProperty({
    example: 1,
    description: 'Number of forks for the repository',
  })
  forks: number;

  @Expose()
  @ApiProperty({
    example: 0,
    description: 'Number of open issues in the repository',
  })
  issues: number;

  @Expose()
  @ApiProperty({
    example: 1742224611000,
    description: 'Repository creation timestamp (in milliseconds)',
  })
  repoCreatedAt: number;

  @Expose()
  @ApiProperty({
    example: '2025-04-27T12:00:00.000Z',
    description: 'Timestamp when the project was added',
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    example: '2025-04-27T12:00:00.000Z',
    description: 'Timestamp when the project was last updated',
  })
  updatedAt: Date;
}

export class PaginatedProjectResponseDto {
  @ApiProperty({ type: [ProjectResponseDto] })
  projects: ProjectResponseDto[];

  @ApiProperty({ example: 20, description: 'Total number of projects' })
  total: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 10, description: 'Number of items per page' })
  limit: number;
}
