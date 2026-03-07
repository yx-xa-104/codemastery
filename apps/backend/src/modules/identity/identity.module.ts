import { Module } from '@nestjs/common';
import { ProfileController } from './presentation/profile.controller';
import { ProfileService } from './application/profile.service';
import { ProfileRepository } from './infrastructure/profile.repository';

@Module({
    controllers: [ProfileController],
    providers: [ProfileService, ProfileRepository],
    exports: [ProfileService],
})
export class IdentityModule { }
