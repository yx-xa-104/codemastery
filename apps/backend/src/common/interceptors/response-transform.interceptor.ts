import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

/**
 * Wraps successful responses in a consistent envelope.
 *
 * Before: { id: 1, name: "foo" }
 * After:  { success: true, data: { id: 1, name: "foo" } }
 */
@Injectable()
export class ResponseTransformInterceptor<T>
    implements NestInterceptor<T, { success: boolean; data: T }> {
    intercept(
        _context: ExecutionContext,
        next: CallHandler<T>,
    ): Observable<{ success: boolean; data: T }> {
        return next.handle().pipe(
            map((data) => ({
                success: true,
                data,
            })),
        );
    }
}
