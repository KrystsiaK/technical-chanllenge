import { UsersResponse } from "@/features/users/interfaces/user";
import { User } from "@/features/users/interfaces/user";
import { apiService } from "@/lib/apiService";

const BASE_URL = "https://reqres.in/api/users";
const HEADERS = {
    "Content-Type": "application/json",
};

export const userService = {
    getUsers(page: number): Promise<UsersResponse> {
        return apiService.get<UsersResponse>(
            `${BASE_URL}?page=${page}`,
            { headers: HEADERS },
            "Failed to fetch users"
        );
    },

    async createUser(user: Omit<User, "id">): Promise<User> {
        const data = await apiService.post<{ id?: number }>(
            BASE_URL,
            user,
            { headers: HEADERS },
            "Failed to create user"
        );

        return {
            ...user,
            id: Number(data?.id) || Date.now(),
        };
    },

    async updateUser(id: number, updates: Partial<User>): Promise<User> {
        await apiService.patch(
            `${BASE_URL}/${id}`,
            updates,
            { headers: HEADERS },
            "Failed to update user"
        );

        return { id, ...updates } as User;
    },


    async deleteUser(id: number): Promise<void> {
        await apiService.delete<void>(
            `${BASE_URL}/${id}`,
            { headers: HEADERS },
            "Failed to delete user"
        );
    }
};