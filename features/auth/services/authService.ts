import { authStorage } from "@/features/auth/services/authStorage";
import { apiService } from "@/lib/apiService";


const BASE_URL = 'https://reqres.in/api';
const JSON_HEADERS = { "Content-Type": "application/json" };

export interface AuthResponse {
    token: string;
};

export interface AuthError {
    error: string;
};

export interface RegisterPayload {
    email: string;
    password: string;
    username: string;
};

export interface LoginPayload {
    email: string;
    password: string;
};

type AuthResult = { success: boolean; token?: string; error?: string };

export const authService = {
    async register({ email, password, username }: RegisterPayload): Promise<AuthResult> {
        try {
            const data = await apiService.post<AuthResponse>(
                `${BASE_URL}/register`,
                { email: 'eve.holt@reqres.in', password: 'pistol' },
                { headers: JSON_HEADERS },
                'Registration failed'
            );

            if (data?.token) {
                authStorage.setToken(data.token);
                authStorage.setUserName(username);
                authStorage.setEmail(email);
                return { success: true, token: data.token };
            }

            return { success: false, error: 'Invalid registration response' };
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Registration failed';
            console.error('Registration failed:', e);
            return { success: false, error: message };
        }
    },

    async login({ email, password }: LoginPayload): Promise<AuthResult> {
        try {
            const data = await apiService.post<AuthResponse>(
                `${BASE_URL}/login`,
                { email: 'eve.holt@reqres.in', password: 'pistol' },
                { headers: JSON_HEADERS },
                'Login failed'
            );

            if (data?.token) {
                authStorage.setToken(data.token);
                authStorage.setEmail(email);
                return { success: true, token: data.token };
            }

            return { success: false, error: 'Invalid login response' };
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Login failed';
            console.error('Login failed:', e);
            return { success: false, error: message };
        }
    },

    async logout(): Promise<AuthResult> {
        try {
            await apiService.post<void>(`${BASE_URL}/logout`);
            return { success: true };
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : "Logout failed";
            console.error("Logout request failed:", e);
            return { success: false, error: message };
        } finally {
            authStorage.clearAll();
        }
    }
}