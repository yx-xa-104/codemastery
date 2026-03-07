import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { SupabaseService } from '@infra/database/supabase.service';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private supabase: SupabaseService,
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

        const { data: profile } = await (this.supabase.admin as any)
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (!profile || !requiredRoles.includes(profile.role)) {
            throw new ForbiddenException('Insufficient permissions');
        }

        // Attach role to request for downstream use
        request.userRole = profile.role;
        return true;
    }
}
