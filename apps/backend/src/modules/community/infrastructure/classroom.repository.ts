import { Injectable } from '@nestjs/common';
import { SupabaseService } from '@infra/database/supabase.service';
import { handleSupabaseError } from '@common/exceptions/supabase-error.util';
import { Tables } from '@infra/database/database.types';

@Injectable()
export class ClassroomRepository {
    constructor(private supabase: SupabaseService) { }

    async findOrCreateClassroom(courseId: string, teacherId: string, name: string): Promise<Tables<'classrooms'>> {
        // Try getting existing
        const { data: existing, error: findError } = await this.supabase.admin
            .from('classrooms')
            .select('*')
            .eq('course_id', courseId)
            .maybeSingle();

        if (findError) handleSupabaseError(findError);
        if (existing) return existing;

        // Create new
        const { data: created, error: createError } = await this.supabase.admin
            .from('classrooms')
            .insert({
                course_id: courseId,
                teacher_id: teacherId,
                name: name,
                is_active: true,
                max_members: 1000
            } as any)
            .select()
            .single();

        if (createError) handleSupabaseError(createError);
        return created as Tables<'classrooms'>;
    }

    async findTeacherClassrooms(teacherId: string) {
        const { data, error } = await this.supabase.admin
            .from('classrooms')
            .select('*, courses(title, slug, level, thumbnail_url, total_enrollments)')
            .eq('teacher_id', teacherId);
        
        if (error) handleSupabaseError(error);
        return data;
    }

    async getClassroomPosts(classroomId: string) {
        const { data, error } = await this.supabase.admin
            .from('classroom_posts')
            .select('*, profiles!classroom_posts_author_id_fkey(full_name, avatar_url, role, student_id, class_code)')
            .eq('classroom_id', classroomId)
            .order('created_at', { ascending: true }); // Chronological like chat

        if (error) handleSupabaseError(error);
        return data;
    }

    async createPost(classroomId: string, authorId: string, content: string, type: string = 'discussion') {
        const { data, error } = await this.supabase.admin
            .from('classroom_posts')
            .insert({
                classroom_id: classroomId,
                author_id: authorId,
                content,
                post_type: type as any
            } as any)
            .select('*, profiles!classroom_posts_author_id_fkey(full_name, avatar_url, role, student_id, class_code)')
            .single();

        if (error) handleSupabaseError(error);
        return data;
    }

    async deletePost(postId: string) {
        const { error } = await this.supabase.admin
            .from('classroom_posts')
            .delete()
            .eq('id', postId);
        
        if (error) handleSupabaseError(error);
    }
}
