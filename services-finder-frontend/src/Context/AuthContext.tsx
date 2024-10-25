import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";
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

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            try {
                const decodedToken = jwtDecode<{ username: string }>(token);
                setUser({ username: decodedToken.username });
            } catch (error) {
                console.error("Invalid token:", error);
                localStorage.removeItem("authToken");
            }
        }
    }, []);

    const login = (token: string) => {
        try {
            const decodedToken = jwtDecode<{ username: string }>(token);
            localStorage.setItem("authToken", token);
            setUser({ username: decodedToken.username });
        } catch (error) {
            console.error("Invalid token:", error);
        }
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        setUser(null);
    };

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
