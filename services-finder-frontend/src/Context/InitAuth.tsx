import React, { useEffect } from "react";
import { useAuth } from "./AuthContext";

const InitAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { login, logout } = useAuth();

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            login(token);
        } else {
            logout();
        }
    }, [login, logout]);

    return <>{children}</>;
};

export default InitAuth;
