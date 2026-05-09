import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { apiClient } from '../lib/api-client';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

// Utility to convert Base64 URL to Uint8Array
function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export function useWebPush() {
    const [isSupported, setIsSupported] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const { user } = useAuthStore(); // Check if user is logged in

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true);
            setPermission(Notification.permission);
            checkSubscription();
        }
    }, []);

    const checkSubscription = async () => {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            const subscription = await registration.pushManager.getSubscription();
            setIsSubscribed(!!subscription);
        } catch (error) {
            console.error('Error checking push subscription', error);
        }
    };

    const subscribe = async () => {
        if (!isSupported) return false;

        try {
            // Xin quyền nếu chưa có
            let currentPermission = Notification.permission;
            if (currentPermission === 'default') {
                currentPermission = await Notification.requestPermission();
                setPermission(currentPermission);
            }

            if (currentPermission !== 'granted') {
                console.warn('Push notification permission denied');
                return false;
            }

            const registration = await navigator.serviceWorker.ready;
            
            // Lấy subscription hiện tại
            let subscription = await registration.pushManager.getSubscription();
            
            // Nếu chưa có thì đăng ký mới
            if (!subscription) {
                if (!VAPID_PUBLIC_KEY) {
                    console.error('VAPID public key is missing. Cannot subscribe to push notifications.');
                    return false;
                }
                const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey
                });
            }

            // Gửi lên server
            if (user) {
                await apiClient.post('/api/notifications/web-push/subscribe', subscription);
                setIsSubscribed(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to subscribe to web push', error);
            return false;
        }
    };

    return {
        isSupported,
        isSubscribed,
        permission,
        subscribe
    };
}
