import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ClassroomRepository } from '../infrastructure/classroom.repository';
import { CourseRepository } from '../../learning/infrastructure/course.repository';
import { NotificationService } from '../../notification/application/notification.service';
import { EnrollmentRepository } from '../../enrollment/infrastructure/enrollment.repository';

@Injectable()
export class ClassroomService {
    constructor(
        private classroomRepository: ClassroomRepository,
        private courseRepository: CourseRepository,
        private notificationService: NotificationService,
        private enrollmentRepository: EnrollmentRepository,
    ) { }

    async ensureClassroomExists(courseId: string) {
        const course = await this.courseRepository.findById(courseId);
        if (!course) throw new NotFoundException('Course not found');
        return this.classroomRepository.findOrCreateClassroom(courseId, course.teacher_id, `Lớp học: ${course.title}`);
    }

    async getTeacherClassrooms(teacherId: string) {
        return this.classroomRepository.findTeacherClassrooms(teacherId);
    }

    async getPosts(courseId: string, requestUserId: string) {
        const classroom = await this.ensureClassroomExists(courseId);
        const posts = await this.classroomRepository.getClassroomPosts(classroom.id) || [];

        const isTeacherForThisCourse = classroom.teacher_id === requestUserId;

        // Anonymize sensitive profile information (student_id, class_code) for other students
        return posts.map((post: any) => {
            const canSeeSensitiveInfo = post.author_id === requestUserId || isTeacherForThisCourse;

            if (!canSeeSensitiveInfo && (post as any).profiles) {
                return {
                    ...post,
                    profiles: {
                        ...(post as any).profiles,
                        student_id: null,
                        class_code: null
                    }
                };
            }
            return post;
        });
    }

    async createPost(courseId: string, authorId: string, content: string, userRole: string, postType: string = 'discussion') {
        const classroom = await this.ensureClassroomExists(courseId);
        
        console.log(`[createPost] authorId: ${authorId}, teacher_id: ${classroom.teacher_id}, courseId: ${courseId}`);
        // If not the teacher, check if they are blocked from this course discussion
        if (authorId !== classroom.teacher_id) {
            const enrollment = await this.enrollmentRepository.findByUserAndCourse(authorId, courseId);
            console.log(`[createPost] enrollment returned:`, enrollment);
            if (enrollment?.is_blocked) {
                console.log(`[createPost] THROWING FORBIDDEN`);
                throw new ForbiddenException('Bạn đã bị chặn tham gia thảo luận khóa học này');
            }
        }
        
        // Let's create the post
        const post = await this.classroomRepository.createPost(classroom.id, authorId, content, postType);
        
        // Notify teacher if author is not the teacher
        if (classroom.teacher_id && classroom.teacher_id !== authorId) {
            await this.notificationService.create(
                classroom.teacher_id,
                'Có câu hỏi mới',
                `Một học viên vừa đặt câu hỏi trong lớp "${classroom.name}"`,
                'system',
                `/teacher/messages`
            );
        }

        return post;
    }

    async deletePost(courseId: string, postId: string, teacherId: string, role: string) {
        const classroom = await this.ensureClassroomExists(courseId);
        if (role !== 'admin' && classroom.teacher_id !== teacherId) {
            throw new ForbiddenException('Only the teacher of this course or admin can delete posts');
        }

        await this.classroomRepository.deletePost(postId);
        return { message: 'Post deleted successfully' };
    }

    async getBlockedStudents(courseId: string, teacherId: string) {
        const classroom = await this.ensureClassroomExists(courseId);
        if (classroom.teacher_id !== teacherId) {
            throw new ForbiddenException('Only the teacher can view blocked students');
        }
        return this.enrollmentRepository.getBlockedStudentsByCourse(courseId);
    }

    async blockStudent(courseId: string, studentId: string, teacherId: string) {
        const classroom = await this.ensureClassroomExists(courseId);
        if (classroom.teacher_id !== teacherId) {
            throw new ForbiddenException('Only the teacher can block students');
        }
        await this.enrollmentRepository.updateBlockStatus(studentId, courseId, true);
        return { message: 'Student blocked successfully' };
    }

    async unblockStudent(courseId: string, studentId: string, teacherId: string) {
        const classroom = await this.ensureClassroomExists(courseId);
        if (classroom.teacher_id !== teacherId) {
            throw new ForbiddenException('Only the teacher can unblock students');
        }
        await this.enrollmentRepository.updateBlockStatus(studentId, courseId, false);
        return { message: 'Student unblocked successfully' };
    }
}
