import { createClient } from "./supabase/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Lớp thiết lập API Client để gọi đến Backend (NestJS).
 * Tự động Inject Supabase Access Token nếu user đã đăng nhập.
 */
export const apiClient = {
    async fetchWithAuth<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        const headers = new Headers(options.headers);
        headers.set("Content-Type", "application/json");

        if (session?.access_token) {
            headers.set("Authorization", `Bearer ${session.access_token}`);
        }

        const url = `${API_URL}${endpoint}`;
        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (!response.ok) {
            // Cố gắng parse response lỗi nếu backend trả JSON
            let errorMsg = `API Error: ${response.status} ${response.statusText}`;
            try {
                const errData = await response.json();
                errorMsg = errData.message || errorMsg;
            } catch (e) {
                // Bỏ qua nếu ko phải JSON
            }
            throw new Error(errorMsg);
        }

        // Return Data or Empty nếu HTTP 204
        if (response.status === 204) {
            return {} as T;
        }

        return response.json();
    },

    get<T>(endpoint: string, options?: RequestInit) {
        return this.fetchWithAuth<T>(endpoint, { ...options, method: 'GET' });
    },

    post<T>(endpoint: string, body: any, options?: RequestInit) {
        return this.fetchWithAuth<T>(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body)
        });
    },

    put<T>(endpoint: string, body: any, options?: RequestInit) {
        return this.fetchWithAuth<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(body)
        });
    },

    delete<T>(endpoint: string, options?: RequestInit) {
        return this.fetchWithAuth<T>(endpoint, { ...options, method: 'DELETE' });
    }
};
