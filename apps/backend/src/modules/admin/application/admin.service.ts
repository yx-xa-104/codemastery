import { Injectable } from '@nestjs/common';
import { AdminRepository } from '../infrastructure/admin.repository';

@Injectable()
export class AdminService {
    constructor(private adminRepository: AdminRepository) { }

    async getDashboardStats() {
        return this.adminRepository.getDashboardStats();
    }

    async getRecentCourses() {
        return this.adminRepository.getRecentCourses();
    }

    async getRecentStudents() {
        return this.adminRepository.getRecentStudents();
    }

    async getReportStats() {
        return this.adminRepository.getReportStats();
    }

    async getTopCourses() {
        return this.adminRepository.getTopCourses();
    }

    async getEnrollmentsByDay(days = 7) {
        return this.adminRepository.getEnrollmentsByDay(days);
    }

    async getStudents() {
        const students: any[] = await this.adminRepository.getStudents();
        const enrollments: any[] = await this.adminRepository.getStudentEnrollments();

        return students.map(student => {
            const studentEnrollments = enrollments.filter(e => e.user_id === student.id);
            const coursesCount = studentEnrollments.length;
            const avgProgress = coursesCount > 0
                ? Math.round(studentEnrollments.reduce((sum, e) => sum + (e.progress_percent || 0), 0) / coursesCount)
                : 0;

            return {
                ...student,
                courses_count: coursesCount,
                avg_progress: avgProgress
            };
        });
    }

    async getRecentEnrollments() {
        return this.adminRepository.getRecentEnrollments();
    }

    async getAllUsers() {
        return this.adminRepository.getAllUsers();
    }

    async updateUserRole(userId: string, role: string) {
        const validRoles = ['student', 'teacher', 'admin'];
        if (!validRoles.includes(role)) {
            throw new Error(`Invalid role: ${role}`);
        }
        return this.adminRepository.updateUserRole(userId, role);
    }

    async updateUserLockStatus(userId: string, locked: boolean) {
        return this.adminRepository.updateUserLockStatus(userId, locked);
    }

    async resetUserPassword(userId: string) {
        return this.adminRepository.resetUserPassword(userId);
    }
}
