import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CoursesService } from './courses.service';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all published courses' })
  @ApiQuery({ name: 'status', required: false, enum: ['draft', 'published', 'archived'] })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'level', required: false, enum: ['beginner', 'intermediate', 'advanced'] })
  findAll(
    @Query('status') status?: string,
    @Query('categoryId') categoryId?: string,
    @Query('level') level?: string,
  ) {
    return this.coursesService.findAll({ status: status || 'published', categoryId, level });
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all course categories' })
  getCategories() {
    return this.coursesService.getCategories();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get course by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.coursesService.findBySlug(slug);
  }

  @Get(':slug/modules')
  @ApiOperation({ summary: 'Get course modules with lessons' })
  async getModules(@Param('slug') slug: string) {
    const course = await this.coursesService.findBySlug(slug);
    return this.coursesService.findModulesWithLessons(course.id);
  }
}
