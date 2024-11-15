import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface DecodedToken {
    _id: string;
    userType: "Proveedor" | "Cliente";
}

interface SocketContextProps {
    socket: Socket | null;
    user: DecodedToken | null;
    emitNotification: (type: string, payload: Record<string, unknown>) => void;
}

const SocketContext = createContext<SocketContextProps>({
    socket: null,
    user: null,
    emitNotification: () => {},
});

export const useSocket = () => useContext(SocketContext);

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
                    socketRef.current?.emit("userStatus", {
                        userId: decoded._id,
                        isOnline: true,
                        lastSeen: null,
                    });
                    console.log("Estado de usuario emitido: Online");
                });

                socketRef.current.on("disconnect", () => {
                    console.log("Desconectado del servidor Socket.IO");
                });

                // Listener para recibir notificaciones
                socketRef.current.on("notification", (data) => {
                    console.log("Notificación recibida:", data);
                    toast.info(`Tipo: ${data.type} - Mensaje: ${data.message}`);
                });

                // Emitir el estado offline antes de cerrar la ventana o pestaña
                const handleBeforeUnload = () => {
                    socketRef.current?.emit("userStatus", {
                        userId: decoded._id,
                        isOnline: false,
                        lastSeen: new Date().toISOString(),
                    });
                    console.log("Estado de usuario emitido: Offline");
                };
                window.addEventListener("beforeunload", handleBeforeUnload);

                // Cleanup
                return () => {
                    window.removeEventListener(
                        "beforeunload",
                        handleBeforeUnload
                    );
                    socketRef.current?.disconnect();
                };
            } catch (error) {
                console.error("Error al decodificar el token:", error);
            }
        } else {
            console.error("No se encontró el token de autenticación.");
        }
    }, []);

    const emitNotification = (
        type: string,
        payload: Record<string, unknown>
    ) => {
        if (socketRef.current) {
            console.log("Emitiendo notificación:", { type, ...payload });
            socketRef.current.emit("notification", { type, ...payload });
        } else {
            console.error("Socket no está conectado.");
        }
    };

    return (
        <SocketContext.Provider
            value={{ socket: socketRef.current, user, emitNotification }}>
            {children}
        </SocketContext.Provider>
    );
};
