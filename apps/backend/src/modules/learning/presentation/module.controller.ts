import { Controller, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SupabaseAuthGuard, RolesGuard, Roles } from '@common/index';
import { ModuleService } from '../application/module.service';
import { CreateModuleDto, UpdateModuleDto, ReorderModulesDto } from './dtos/module.dto';

@ApiTags('modules')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Roles('teacher', 'admin')
@Controller('courses')
export class ModuleController {
    constructor(private moduleService: ModuleService) { }

    @Post(':courseId/modules')
    @ApiOperation({ summary: 'Create a module for a course' })
    create(@Param('courseId') courseId: string, @Body() body: CreateModuleDto) {
        return this.moduleService.create(courseId, body.title, body.sort_order);
    }

    @Patch('modules/:id')
    @ApiOperation({ summary: 'Update a module' })
    update(@Param('id') id: string, @Body() body: UpdateModuleDto) {
        return this.moduleService.update(id, body);
    }

    @Delete('modules/:id')
    @ApiOperation({ summary: 'Delete a module' })
    remove(@Param('id') id: string) {
        return this.moduleService.delete(id);
    }

    @Patch('modules/reorder')
    @ApiOperation({ summary: 'Reorder modules' })
    reorder(@Body() body: ReorderModulesDto) {
        return this.moduleService.reorder(body.items);
    }
}
