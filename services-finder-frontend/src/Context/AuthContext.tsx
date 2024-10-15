import React, { createContext, useContext, useState, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface User {
    username: string;
}

interface AuthContextType {
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);

    const login = (token: string) => {
        interface DecodedToken {
            username: string;
        }
        const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);

        // Only update user if it actually changes.
        if (user?.username !== decodedToken.username) {
            setUser({ username: decodedToken.username });
        }
    };

    const logout = () => setUser(null);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
