import { Injectable } from '@nestjs/common';
import { AdminRepository } from '../infrastructure/admin.repository';

@Injectable()
export class AdminService {
    constructor(private adminRepository: AdminRepository) { }

    async getDashboardStats() {
        return this.adminRepository.getDashboardStats();
    }

    async getReportStats() {
        return this.adminRepository.getReportStats();
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
}
