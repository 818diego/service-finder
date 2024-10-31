import axios from "axios";
import { User, RegisterResponse } from "../types/users";

const apiClient = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    headers: {
        "Content-Type": "application/json",
    },
});

export const registerUser = async (data: User): Promise<RegisterResponse> => {
    try {
        const response = await apiClient.post<RegisterResponse>(
            "/register",
            data
        );
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Unexpected error:", error.message);
        }
        throw new Error("Registration failed");
    }
};

export const loginUser = async (data: User): Promise<RegisterResponse> => {
    try {
        const response = await apiClient.post<RegisterResponse>("/login", data);
        const token = response.data.token;
        if (token) {
            localStorage.setItem("authToken", token);
        }
        console.log("Token:", token);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Unexpected error:", error.message);
        }
        throw new Error("Login failed");
    }
};
