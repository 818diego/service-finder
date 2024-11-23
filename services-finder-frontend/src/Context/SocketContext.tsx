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
    name?: string;
}

interface Notification {
    type: string;
    message: string;
    chatId?: string;
    senderId?: string;
    senderName?: string;
    proposal?: Record<string, unknown>;
}

interface SocketContextProps {
    socket: Socket | null;
    user: DecodedToken | null;
    emitNotification: (type: string, payload: Record<string, unknown>) => void;
    notifications: Notification[];
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const SocketContext = createContext<SocketContextProps>({
    socket: null,
    user: null,
    emitNotification: () => {},
    notifications: [],
    setNotifications: () => {},
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
    children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const socketRef = useRef<Socket | null>(null);
    const [user, setUser] = useState<DecodedToken | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("authToken");

        if (token) {
            try {
                const decoded: DecodedToken = jwtDecode(token);
                setUser(decoded);

                // Inicializar el cliente Socket.IO
                socketRef.current = io(import.meta.env.VITE_API_URL, {
                    auth: { token },
                });

                // Eventos de conexión
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

                socketRef.current.on("connect_error", (error) => {
                    console.error("Error de conexión:", error);
                    toast.error("Error al conectar con el servidor.");
                });

                // Listener para recibir notificaciones
                socketRef.current.on("notification", (data: Notification) => {
                    console.log("Notificación recibida:", data);
                    setNotifications((prev) => [data, ...prev]); // Almacena la notificación
                    toast.info(
                        `${data.message} ${
                            data.senderName ? `de ${data.senderName}` : ""
                        }`
                    );
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
            socketRef.current.emit(type, payload); // Emite un evento genérico al servidor
        } else {
            console.error("Socket no está conectado.");
        }
    };

    return (
        <SocketContext.Provider
            value={{
                socket: socketRef.current,
                user,
                emitNotification,
                notifications,
                setNotifications,
            }}>
            {children}
        </SocketContext.Provider>
    );
};
