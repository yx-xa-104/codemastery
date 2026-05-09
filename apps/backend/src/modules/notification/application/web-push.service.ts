import { Injectable, Logger } from '@nestjs/common';
import * as webPush from 'web-push';
import { SupabaseService } from '../../../infrastructure/database/supabase.service';

@Injectable()
export class WebPushService {
    private readonly logger = new Logger(WebPushService.name);

    constructor(private readonly supabase: SupabaseService) {
        // Cấu hình VAPID keys. Trong thực tế, bạn cần đặt trong .env
        // npx web-push generate-vapid-keys
        const publicKey = process.env.VAPID_PUBLIC_KEY;
        const privateKey = process.env.VAPID_PRIVATE_KEY;
        const subject = process.env.VAPID_SUBJECT;

        try {
            if (publicKey && privateKey && subject) {
                webPush.setVapidDetails(subject, publicKey, privateKey);
                this.logger.log('Web Push VAPID keys configured successfully.');
            } else {
                this.logger.warn('VAPID keys are missing in .env. Web Push feature will be disabled.');
            }
        } catch (error) {
            this.logger.error('Error configuring Web Push VAPID details', error);
        }
    }

    async saveSubscription(userId: string, subscription: any) {
        const { endpoint, keys } = subscription;
        if (!endpoint || !keys) {
            throw new Error('Invalid subscription payload');
        }

        const { data, error } = await (this.supabase.admin
            .from('web_push_subscriptions' as any) as any)
            .upsert({
                user_id: userId,
                endpoint: endpoint,
                p256dh: keys.p256dh,
                auth: keys.auth
            }, { onConflict: 'endpoint' });

        if (error) {
            this.logger.error('Failed to save push subscription', error);
            throw new Error('Failed to save subscription');
        }
        return { success: true };
    }

    async sendPushToUser(userId: string, payload: any) {
        const { data: subsData, error } = await (this.supabase.admin
            .from('web_push_subscriptions' as any) as any)
            .select('*')
            .eq('user_id', userId);

        const subs = subsData as any[];
        if (error || !subs || subs.length === 0) {
            // No subscriptions found for this user, silently ignore
            return;
        }

        const payloadString = JSON.stringify(payload);
        
        const sendPromises = subs.map(async (sub) => {
            const pushSubscription = {
                endpoint: sub.endpoint,
                keys: {
                    p256dh: sub.p256dh,
                    auth: sub.auth,
                },
            };

            try {
                await webPush.sendNotification(pushSubscription, payloadString);
            } catch (err: any) {
                if (err.statusCode === 404 || err.statusCode === 410) {
                    // Subscription has expired or is no longer valid, delete it
                    this.logger.log(`Subscription expired, deleting endpoint: ${sub.endpoint}`);
                    await (this.supabase.admin
                        .from('web_push_subscriptions' as any) as any)
                        .delete()
                        .eq('id', sub.id);
                } else {
                    this.logger.error('Failed to send push notification', err);
                }
            }
        });

        await Promise.allSettled(sendPromises);
    }
}
