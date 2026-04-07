import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { SupabaseService } from '@infra/database/supabase.service';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private supabase: SupabaseService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new ForbiddenException('Authentication required');
        }

        // Attach role to request for downstream use (even if no role is strictly required, it's good to have)
        // Check cache first
        const cacheKey = `user_role_${user.id}`;
        let userRole = await this.cacheManager.get<string>(cacheKey);

        if (!userRole) {
            const { data, error } = await this.supabase.admin
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            const profile = data as unknown as { role: string };

            if (error || !profile) {
                if (requiredRoles && requiredRoles.length > 0) {
                    throw new ForbiddenException('Insufficient permissions');
                }
                return true;
            }

            userRole = profile.role;
            // Cache the role for 5 minutes (300000ms)
            await this.cacheManager.set(cacheKey, userRole, 300000);
        }

        if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
            throw new ForbiddenException('Insufficient permissions');
        }

        request.userRole = userRole;
        return true;
    }
}
