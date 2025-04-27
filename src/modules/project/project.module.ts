import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { HttpModule } from '@nestjs/axios';
import { HttpExceptionInterceptor } from '../../interceptors/http-exception.interceptor';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    AuthModule,
  ],
  providers: [
    ProjectService,
    {
      provide: 'HTTP_INTERCEPTOR',
      useClass: HttpExceptionInterceptor,
    },
  ],
  controllers: [ProjectController],
})
export class ProjectModule {}
