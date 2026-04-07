import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SupabaseAuthGuard, RolesGuard, Roles, CurrentUser } from '@common/index';
import { CourseService } from '../application/course.service';
import { FindCoursesDto } from './dtos/find-courses.dto';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';
import { CreateCategoryDto, UpdateCategoryDto } from './dtos/category.dto';

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

    @Get('my')
    @ApiOperation({ summary: 'Get courses created by current teacher' })
    @ApiBearerAuth()
    @UseGuards(SupabaseAuthGuard, RolesGuard)
    @Roles('teacher')
    findMyCourses(@CurrentUser('id') userId: string) {
        return this.courseService.findByTeacher(userId);
    }

    @Get('search')
    @ApiOperation({ summary: 'Search courses by keyword' })
    search(@Query('q') q: string) {
        return this.courseService.search(q || '');
    }

    @Get('categories')
    @ApiOperation({ summary: 'Get all course categories' })
    getCategories() {
        return this.courseService.getCategories();
    }

    @Post('categories')
    @ApiOperation({ summary: 'Create a category (admin)' })
    @ApiBearerAuth()
    @UseGuards(SupabaseAuthGuard, RolesGuard)
    @Roles('admin')
    createCategory(@Body() body: CreateCategoryDto) {
        return this.courseService.createCategory(body.name, body.icon, body.sort_order);
    }

    @Patch('categories/:id')
    @ApiOperation({ summary: 'Update a category (admin)' })
    @ApiBearerAuth()
    @UseGuards(SupabaseAuthGuard, RolesGuard)
    @Roles('admin')
    updateCategory(@Param('id') id: string, @Body() body: UpdateCategoryDto) {
        return this.courseService.updateCategory(id, body);
    }

    @Delete('categories/:id')
    @ApiOperation({ summary: 'Delete a category (admin)' })
    @ApiBearerAuth()
    @UseGuards(SupabaseAuthGuard, RolesGuard)
    @Roles('admin')
    deleteCategory(@Param('id') id: string) {
        return this.courseService.deleteCategory(id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get course by ID' })
    findById(@Param('id') id: string) {
        // Simple check if it's a UUID to differentiate from slug
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        if (isUuid) {
            return this.courseService.findById(id);
        }
        return this.courseService.findBySlug(id);
    }

    @Get(':slug/modules')
    @ApiOperation({ summary: 'Get course modules with lessons' })
    async getModules(@Param('slug') slug: string) {
        const course = await this.courseService.findBySlug(slug);
        return this.courseService.findModulesWithLessons(course.id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a course (teacher)' })
    @ApiBearerAuth()
    @UseGuards(SupabaseAuthGuard, RolesGuard)
    @Roles('teacher')
    create(@CurrentUser('id') userId: string, @Body() body: CreateCourseDto) {
        return this.courseService.create({ ...body, teacher_id: userId } as any);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a course (owner)' })
    @ApiBearerAuth()
    @UseGuards(SupabaseAuthGuard, RolesGuard)
    @Roles('teacher')
    update(
        @Param('id') id: string,
        @Body() body: UpdateCourseDto,
        @CurrentUser('id') userId: string,
        @CurrentUser('role') userRole: string,
    ) {
        return this.courseService.update(id, body as any, userId, userRole);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a course (owner)' })
    @ApiBearerAuth()
    @UseGuards(SupabaseAuthGuard, RolesGuard)
    @Roles('teacher')
    remove(
        @Param('id') id: string,
        @CurrentUser('id') userId: string,
        @CurrentUser('role') userRole: string,
    ) {
        return this.courseService.delete(id, userId, userRole);
    }
}

