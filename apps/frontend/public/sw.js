self.addEventListener('push', function (event) {
    if (event.data) {
        try {
            const data = event.data.json();
            const options = {
                body: data.body,
                icon: '/icons/icon-192x192.png',
                badge: '/icons/icon-72x72.png',
                vibrate: [100, 50, 100],
                data: {
                    url: data.url || '/',
                },
                requireInteraction: true // Giữ thông báo không tự biến mất
            };
            
            event.waitUntil(
                self.registration.showNotification(data.title, options)
            );
        } catch (e) {
            console.error('Error parsing push data', e);
        }
    }
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    
    // Mở trang web khi bấm vào thông báo
    const urlToOpen = event.notification.data.url || '/';
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (windowClients) {
            // Nếu trang web đã mở, focus vào tab đó và chuyển trang
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url.includes(urlToOpen) && 'focus' in client) {
                    return client.focus();
                }
            }
            // Nếu chưa mở, mở tab mới
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
