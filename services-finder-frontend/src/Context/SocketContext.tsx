import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    _id: string;
    userType: "Proveedor" | "Cliente";
}

interface SocketContextProps {
    socket: Socket | null;
    user: DecodedToken | null;
}

const SocketContext = createContext<SocketContextProps>({
    socket: null,
    user: null,
});

export const useSocket = () => {
    return useContext(SocketContext);
};

interface SocketProviderProps {
    children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const socketRef = useRef<Socket | null>(null);
    const [user, setUser] = useState<DecodedToken | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            try {
                const decoded: DecodedToken = jwtDecode(token);
                setUser(decoded);

                // Inicializar Socket.IO client
                socketRef.current = io("http://localhost:3000", {
                    auth: { token },
                });

                socketRef.current.on("connect", () => {
                    console.log("Conectado al servidor Socket.IO");
                });

                socketRef.current.on("disconnect", () => {
                    console.log("Desconectado del servidor Socket.IO");
                });

                // Emitir el estado del usuario al conectarse
                socketRef.current.emit("userStatus", {
                    userId: decoded._id,
                    isOnline: true,
                    lastSeen: null,
                });

                // Emitir el estado del usuario al desconectarse
                window.addEventListener("beforeunload", () => {
                    socketRef.current?.emit("userStatus", {
                        userId: decoded._id,
                        isOnline: false,
                        lastSeen: new Date().toISOString(),
                    });
                });
            } catch (error) {
                console.error("Error al decodificar el token:", error);
            }
        } else {
            console.error("No se encontró el token de autenticación.");
        }

        // Cleanup on unmount
        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket: socketRef.current, user }}>
            {children}
        </SocketContext.Provider>
    );
};
