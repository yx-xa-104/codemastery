import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CourseService } from '../application/course.service';
import { FindCoursesDto } from './dtos/find-courses.dto';

@ApiTags('courses')
@Controller('courses')
export class CourseController {
    constructor(private courseService: CourseService) { }

    @Get()
    @ApiOperation({ summary: 'Get all published courses' })
    findAll(@Query() query: FindCoursesDto) {
        return this.courseService.findAll({
            status: query.status || 'published',
            categoryId: query.categoryId,
            level: query.level,
        });
    }

    @Get('categories')
    @ApiOperation({ summary: 'Get all course categories' })
    getCategories() {
        return this.courseService.getCategories();
    }

    @Get(':slug')
    @ApiOperation({ summary: 'Get course by slug' })
    findBySlug(@Param('slug') slug: string) {
        return this.courseService.findBySlug(slug);
    }

    @Get(':slug/modules')
    @ApiOperation({ summary: 'Get course modules with lessons' })
    async getModules(@Param('slug') slug: string) {
        const course = await this.courseService.findBySlug(slug);
        return this.courseService.findModulesWithLessons(course.id);
    }
}
