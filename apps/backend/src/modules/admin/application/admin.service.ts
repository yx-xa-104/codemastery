import { Injectable } from '@nestjs/common';
import { AdminRepository } from '../infrastructure/admin.repository';
import { Response } from 'express';
import * as excel from 'exceljs';

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

    async exportAdminReports(res: Response, range: string) {
        const { stats, limitDateStr, enrollments } = await this.adminRepository.getExportDataForRange(range);

        const workbook = new excel.Workbook();
        workbook.creator = 'CodeMastery Admin';
        workbook.created = new Date();

        // Sheet 1: Overview
        const overviewSheet = workbook.addWorksheet('Tổng quan');
        overviewSheet.columns = [
            { header: 'Chỉ số', key: 'metric', width: 30 },
            { header: 'Giá trị', key: 'value', width: 20 },
        ];
        
        overviewSheet.addRow({ metric: `Thống kê từ ngày`, value: new Date(limitDateStr).toLocaleDateString('vi-VN') });
        overviewSheet.addRow({ metric: 'Học viên mới', value: stats.studentCount });
        overviewSheet.addRow({ metric: 'Lượt đăng ký khoá học', value: stats.enrollCount });
        overviewSheet.addRow({ metric: 'Khóa học tạo mới', value: stats.courseCount });
        overviewSheet.addRow({ metric: 'Đánh giá trung bình mới', value: stats.avgRating });

        overviewSheet.getRow(1).font = { bold: true };
        overviewSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD3D3D3' } };

        // Sheet 2: Enrollments
        const enrollSheet = workbook.addWorksheet('Lượt đăng ký chi tiết');
        enrollSheet.columns = [
            { header: 'Thời gian', key: 'time', width: 20 },
            { header: 'Học viên', key: 'student', width: 25 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Khóa học', key: 'course', width: 35 },
            { header: 'Tiến độ (%)', key: 'progress', width: 15 },
        ];

        enrollments.forEach((e: any) => {
            const student = Array.isArray(e.profiles) ? e.profiles[0] : (e.profiles || {});
            const course = Array.isArray(e.courses) ? e.courses[0] : (e.courses || {});

            enrollSheet.addRow({
                time: new Date(e.enrolled_at).toLocaleString('vi-VN'),
                student: student.full_name || 'N/A',
                email: student.email || 'N/A',
                course: course.title || 'N/A',
                progress: e.progress_percent || 0
            });
        });
        enrollSheet.getRow(1).font = { bold: true };
        enrollSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD3D3D3' } };

        const fileName = `CodeMastery_Report_${range}_${new Date().toISOString().split('T')[0]}.xlsx`;

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        await workbook.xlsx.write(res);
        res.end();
    }
}
