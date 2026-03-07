import { Module } from '@nestjs/common';
import { AdminController } from './presentation/admin.controller';
import { AdminService } from './application/admin.service';
import { AdminRepository } from './infrastructure/admin.repository';
import { SupabaseModule } from '@infra/database/supabase.module';

@Module({
    imports: [SupabaseModule],
    controllers: [AdminController],
    providers: [AdminService, AdminRepository],
    exports: [AdminService],
})
export class AdminModule { }
