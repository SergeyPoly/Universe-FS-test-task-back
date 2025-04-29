import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProjectService } from './project.service';
import { ProjectPathDto } from './dto/project-path.dto';
import RequestWithUser from '../auth/types/request-with-user.interface';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import {
  PaginatedProjectResponseDto,
  ProjectResponseDto,
} from './dto/project-response.dto';

@ApiTags('Projects')
@ApiBearerAuth()
@Controller('projects')
@UseGuards(AuthGuard())
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({
    status: 201,
    description: 'The project has been successfully created.',
    type: ProjectResponseDto,
  })
  async create(
    @Body() createProjectDto: ProjectPathDto,
    @Req() req: RequestWithUser,
  ) {
    return this.projectService.createProject(createProjectDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects of current user' })
  @ApiOkResponse({
    description: 'Paginated list of user projects',
    type: PaginatedProjectResponseDto,
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async getAll(
    @Req() req: RequestWithUser,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return this.projectService.getAllProjects(
      req.user.id,
      pageNumber,
      limitNumber,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update current project' })
  @ApiOkResponse({
    description: 'Project updated successfully',
    type: ProjectResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Project not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Project ID',
  })
  async update(
    @Param('id', new ParseUUIDPipe()) projectId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.projectService.updateProject(projectId, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project by ID' })
  @ApiOkResponse({ description: 'Project deleted successfully' })
  @ApiNotFoundResponse({ description: 'Project not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Project ID',
  })
  async delete(
    @Param('id', new ParseUUIDPipe()) projectId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.projectService.deleteProject(projectId, req.user.id);
  }
}
