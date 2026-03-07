import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '@infra/database/supabase.service';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
    constructor(private supabase: SupabaseService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            throw new UnauthorizedException('Missing or invalid authorization header');
        }

        const token = authHeader.substring(7);

        const { data, error } = await this.supabase.admin.auth.getUser(token);

        if (error || !data.user) {
            throw new UnauthorizedException('Invalid or expired token');
        }

        // Attach user and token to request for downstream use
        request.user = data.user;
        request.accessToken = token;

        return true;
    }
}
