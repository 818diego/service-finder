import React, { useEffect } from "react";
import { useAuth } from "./AuthContext";

const InitAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { login } = useAuth();

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            login(token);
        }
    }, [login]);

    return <>{children}</>;
};

export default InitAuth;
