import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { ProjectPathDto } from './dto/project-path.dto';
import { ProjectDataDto } from './dto/project-data.dto';
import { plainToInstance } from 'class-transformer';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { User } from '../user/user.entity';
import { AxiosResponse } from 'axios';
import { GithubDataDto } from './dto/githab-data.dto';
import {
  PaginatedProjectResponseDto,
  ProjectResponseDto,
} from './dto/project-response.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly httpService: HttpService,
  ) {}

  async createProject(
    createProjectDto: ProjectPathDto,
    user: User,
  ): Promise<ProjectResponseDto> {
    const { repositoryPath } = createProjectDto;
    const data = await this.fetchProjectData(repositoryPath);

    const existingProject = await this.projectRepository.findOne({
      where: { url: data.url, user: { id: user.id } },
    });

    if (existingProject) {
      throw new ConflictException('This repository has already been added.');
    }
    const updatedData = {
      user,
      ...data,
    };

    const project = this.projectRepository.create(updatedData);
    const savedProject = this.projectRepository.save(project);
    return plainToInstance(ProjectResponseDto, savedProject, {
      excludeExtraneousValues: true,
    });
  }

  async updateProject(
    projectId: string,
    userId: string,
  ): Promise<ProjectResponseDto> {
    const project = await this.checkPermission(projectId, userId);

    const repositoryPath = `${project.ownerName}/${project.repoName}`;
    const updatedData = await this.fetchProjectData(repositoryPath);

    Object.assign(project, updatedData);

    const savedProject = this.projectRepository.save(project);
    return plainToInstance(ProjectResponseDto, savedProject, {
      excludeExtraneousValues: true,
    });
  }

  async getAllProjects(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedProjectResponseDto> {
    const [projects, total] = await this.projectRepository.findAndCount({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const data = projects.map((project) =>
      plainToInstance(ProjectResponseDto, project, {
        excludeExtraneousValues: true,
      }),
    );

    return { data, total, page, limit };
  }

  async deleteProject(
    projectId: string,
    userId: string,
  ): Promise<{ message: string }> {
    const project = await this.checkPermission(projectId, userId);

    await this.projectRepository.remove(project);

    return { message: 'Project successfully deleted.' };
  }

  async fetchProjectData(repositoryPath: string): Promise<ProjectDataDto> {
    const url = `https://api.github.com/repos/${repositoryPath}`;

    const response: AxiosResponse = await firstValueFrom(
      this.httpService.get(url),
    );

    if (!response || !response.data) {
      throw new InternalServerErrorException('Empty response from GitHub API');
    }
    const data = response.data as GithubDataDto;
    const projectData: ProjectDataDto = {
      ownerName: data.owner.login,
      repoName: data.name,
      url: data.html_url,
      stars: data.stargazers_count,
      forks: data.forks_count,
      issues: data.open_issues_count,
      repoCreatedAt: data.created_at,
    };

    return plainToInstance(ProjectDataDto, projectData, {
      excludeExtraneousValues: true,
    });
  }

  async checkPermission(projectId: string, userId: string) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['user'],
    });

    if (!project) {
      throw new NotFoundException('Project not found.');
    }

    if (project.user.id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to operate this project.',
      );
    }

    return project;
  }
}
