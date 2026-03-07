import { Injectable } from '@nestjs/common';
import { ModuleRepository } from '../infrastructure/module.repository';

@Injectable()
export class ModuleService {
    constructor(private moduleRepository: ModuleRepository) { }

    async create(courseId: string, title: string, sortOrder?: number) {
        return this.moduleRepository.create(courseId, title, sortOrder);
    }

    async update(id: string, updates: { title?: string; sort_order?: number }) {
        return this.moduleRepository.update(id, updates);
    }

    async delete(id: string) {
        return this.moduleRepository.delete(id);
    }

    async reorder(items: { id: string; sort_order: number }[]) {
        return this.moduleRepository.reorder(items);
    }
}
