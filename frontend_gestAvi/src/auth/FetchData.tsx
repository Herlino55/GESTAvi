import { User } from "../types/user";

// const API_URL = "http://localhost:3000/api/auth"; // Adjust port if needed
const API_URL = "users.json"; // Adjust port if needed

interface LoginResponse {
    user: User;
    token: string;
}

export const loginUser = async (email: string, password: string): Promise<User | null> => {
    try {
        const response = await fetch(`${API_URL}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            // body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Login failed:", errorData.message || response.statusText);
            return null;
        }

        const data: LoginResponse = await response.json();

        // Assuming the backend returns the user object and maybe a token
        // You might want to store the token here or in the store
        // localStorage.setItem('token', data.token); 

        return data.user;
    } catch (error) {
        console.error("An error occurred during login:", error);
        return null;
    }
};
