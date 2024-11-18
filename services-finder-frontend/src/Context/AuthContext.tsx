import { jwtDecode } from "jwt-decode";
import { User } from "../types/users";
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

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

    const isTokenExpired = (token: string): boolean => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const decodedToken: any = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            return decodedToken.exp < currentTime;
        } catch (error) {
            console.error("Error decoding token:", error);
            return true;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token && !isTokenExpired(token)) {
            try {
                const decodedToken = jwtDecode<User>(token);
                setUser(decodedToken);
            } catch (error) {
                console.error("Invalid token:", error);
                localStorage.removeItem("authToken");
            }
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("authToken");
        setUser(null);
    }, []);

    const login = useCallback(
        (token: string) => {
            try {
                if (!isTokenExpired(token)) {
                    const decodedToken = jwtDecode<User>(token);
                    localStorage.setItem("authToken", token);
                    setUser(decodedToken);
                } else {
                    console.error("Token has expired");
                    logout();
                }
            } catch (error) {
                console.error("Invalid token:", error);
                logout();
            }
        },
        [logout]
    );

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
