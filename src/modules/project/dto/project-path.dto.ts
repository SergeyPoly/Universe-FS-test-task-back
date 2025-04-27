import { IsNotEmpty, IsString } from 'class-validator';

export class ProjectPathDto {
  @IsNotEmpty()
  @IsString()
  repositoryPath: string;
}
