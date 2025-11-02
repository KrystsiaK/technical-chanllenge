const DEFAULT_TIMEOUT = 8000;
const DEFAULT_HEADERS = { "x-api-key": "reqres-free-v1" };
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const apiRequest = async <T>(
    url: string,
    options: RequestInit = {},
    fallbackError = "Unexpected error"
): Promise<T> => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...DEFAULT_HEADERS,
                ...(options.headers || {}),
            },
            signal: controller.signal,
        });

        clearTimeout(timeout);

        const text = await response.text();
        let data;

        try {
            data = text ? JSON.parse(text) : {};
        } catch (error) {
            data = {};
        }

        if (!response.ok) {
            const message = data?.error ?? `${response.status} ${response.statusText}`;
            throw new Error(message || fallbackError);
        }

        return data as T;
    } catch (err: any) {
        if (err.name === "AbortError") {
            throw new Error("Request timed out");
        }
        throw new Error(err.message || fallbackError);
    } finally {
        clearTimeout(timeout);
    }
}

const buildOptions = (
    method: HttpMethod,
    options: RequestInit = {},
    body?: unknown
): RequestInit => {
    return {
        ...options,
        method,
        ...(body ? { body: JSON.stringify(body) } : {}),
    };
};

export const apiService = {
    get: <T>(url: string, options: RequestInit = {}, fallbackError?: string) =>
        apiRequest<T>(url, buildOptions("GET", options), fallbackError),

    post: <T>(
        url: string,
        body?: unknown,
        options: RequestInit = {},
        fallbackError?: string
    ) => apiRequest<T>(url, buildOptions("POST", options, body), fallbackError),

    put: <T>(
        url: string,
        body?: unknown,
        options: RequestInit = {},
        fallbackError?: string
    ) => apiRequest<T>(url, buildOptions("PUT", options, body), fallbackError),

    patch: <T>(
        url: string,
        body?: unknown,
        options: RequestInit = {},
        fallbackError?: string
    ) => apiRequest<T>(url, buildOptions("PATCH", options, body), fallbackError),

    delete: <T>(url: string, options: RequestInit = {}, fallbackError?: string) =>
        apiRequest<T>(url, buildOptions("DELETE", options), fallbackError),
};