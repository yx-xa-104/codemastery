import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

/** Supabase PostgREST "no rows returned" error code */
const PGRST116 = 'PGRST116';

/**
 * Converts a Supabase error into a proper NestJS HTTP exception.
 *
 * @param error - The error object from a Supabase query
 * @param notFoundMessage - Optional custom "not found" message
 */
export function handleSupabaseError(
  error: unknown,
  notFoundMessage = 'Resource not found',
): never {
  const err = error as { code?: string; message?: string };

  if (err?.code === PGRST116) {
    throw new NotFoundException(notFoundMessage);
  }

  const message = err?.message ?? 'An unexpected database error occurred';
  throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
}
