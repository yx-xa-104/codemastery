import { ConfigService } from '@nestjs/config';

/**
 * Central application configuration.
 * Extend this as the app grows.
 */
export interface AppConfig {
    port: number;
    allowedOrigins: string[];
    nodeEnv: string;
}

export const loadAppConfig = (config: ConfigService): AppConfig => ({
    port: parseInt(config.get<string>('PORT', '3001'), 10),
    allowedOrigins: config
        .get<string>('ALLOWED_ORIGINS', 'http://localhost:3000')
        .split(','),
    nodeEnv: config.get<string>('NODE_ENV', 'development'),
});
