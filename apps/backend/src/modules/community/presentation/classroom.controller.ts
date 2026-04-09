import { Controller, Get, Post, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ClassroomService } from '../application/classroom.service';
import { SupabaseAuthGuard, RolesGuard, Roles } from '@common/index';

@Controller('classrooms')
@UseGuards(SupabaseAuthGuard)
export class ClassroomController {
    constructor(private readonly classroomService: ClassroomService) { }

    @Get('teacherhips')
    @UseGuards(RolesGuard)
    @Roles('teacher', 'admin')
    async getTeacherClassrooms(@Req() req: any) {
        return this.classroomService.getTeacherClassrooms(req.user.id);
    }

    @Get('course/:courseId/posts')
    async getCourseClassroomPosts(@Param('courseId') courseId: string, @Req() req: any) {
        return this.classroomService.getPosts(courseId, req.user.id);
    }

    @Post('course/:courseId/posts')
    async createPost(
        @Param('courseId') courseId: string,
        @Body() body: { content: string, type?: string },
        @Req() req: any
    ) {
        return this.classroomService.createPost(
            courseId,
            req.user.id,
            body.content,
            req.user.role,
            body.type
        );
    }

    @Delete('course/:courseId/posts/:postId')
    @UseGuards(RolesGuard)
    @Roles('teacher', 'admin')
    async deletePost(
        @Param('courseId') courseId: string,
        @Param('postId') postId: string,
        @Req() req: any
    ) {
        return this.classroomService.deletePost(courseId, postId, req.user.id, req.user.role);
    }

    @Get('course/:courseId/blocked')
    @UseGuards(RolesGuard)
    @Roles('teacher', 'admin')
    async getBlockedStudents(
        @Param('courseId') courseId: string,
        @Req() req: any
    ) {
        return this.classroomService.getBlockedStudents(courseId, req.user.id);
    }

    @Post('course/:courseId/block/:studentId')
    @UseGuards(RolesGuard)
    @Roles('teacher', 'admin')
    async blockStudent(
        @Param('courseId') courseId: string,
        @Param('studentId') studentId: string,
        @Req() req: any
    ) {
        return this.classroomService.blockStudent(courseId, studentId, req.user.id);
    }

    @Post('course/:courseId/unblock/:studentId')
    @UseGuards(RolesGuard)
    @Roles('teacher', 'admin')
    async unblockStudent(
        @Param('courseId') courseId: string,
        @Param('studentId') studentId: string,
        @Req() req: any
    ) {
        return this.classroomService.unblockStudent(courseId, studentId, req.user.id);
    }
}
