import { safeLocalStorage } from "@/lib/safeLocalStorage";

interface AuthStorage {
    getToken: () => string | null;
    setToken: (token: string) => void;
    removeToken: () => void;
    getUserName: () => string | null;
    setUserName: (username: string) => void;
    removeUserName: () => void;
    getEmail: () => string | null;
    setEmail: (email: string) => void;
    removeEmail: () => void;
    clearAll: () => void;
}

const AUTH_KEYS = ['token', 'username', 'email'] as const;
type AuthKey = typeof AUTH_KEYS[number];

const PREFIX = 'auth.';
const getAuthKey = (key: string) => `${PREFIX}${key}`;

const set = (key: string, value: string) => safeLocalStorage.setItem(getAuthKey(key), value);
const get = (key: string) => safeLocalStorage.getItem(getAuthKey(key));
const remove = (key: string) => safeLocalStorage.removeItem(getAuthKey(key));

export const authStorage: AuthStorage = {
    getToken: () => get('token'),
    setToken: (token: string) => set('token', token),
    removeToken: () => remove('token'),
    getUserName: () => get('username'),
    setUserName: (username: string) => set('username', username),
    removeUserName: () => remove('username'),
    getEmail: () => get('email'),
    setEmail: (email: string) => set('email', email),
    removeEmail: () => remove('email'),
    clearAll: () => AUTH_KEYS.forEach(remove),
};