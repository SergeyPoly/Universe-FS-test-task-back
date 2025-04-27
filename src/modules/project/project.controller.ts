import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProjectService } from './project.service';
import { ProjectPathDto } from './dto/project-path.dto';
import RequestWithUser from '../auth/types/request-with-user.interface';

@Controller('projects')
@UseGuards(AuthGuard())
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async create(
    @Body() createProjectDto: ProjectPathDto,
    @Req() req: RequestWithUser,
  ) {
    return this.projectService.createProject(createProjectDto, req.user);
  }

  @Patch(':id')
  async update(@Param('id') projectId: string, @Req() req: RequestWithUser) {
    return this.projectService.updateProject(projectId, req.user.id);
  }

  @Get()
  async getAll(@Req() req: RequestWithUser) {
    return this.projectService.getAllProjects(req.user.id);
  }

  @Delete(':id')
  async delete(@Param('id') projectId: string, @Req() req: RequestWithUser) {
    return this.projectService.deleteProject(projectId, req.user.id);
  }
}
