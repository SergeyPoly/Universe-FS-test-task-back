import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProjectPathDto {
  @ApiProperty({
    description: 'Path to GitHub repository',
    example: 'facebook/react',
  })
  @IsNotEmpty()
  @IsString()
  repositoryPath: string;
}
