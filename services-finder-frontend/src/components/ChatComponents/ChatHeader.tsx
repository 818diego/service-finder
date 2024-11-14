import React, { useEffect, useState } from "react";
import { Trash2, ShieldAlert, Lock, Archive } from "lucide-react";
import { useSocket } from "../../Context/SocketContext";
import { getUserStatus } from "../../services/chatsFetch";

interface ChatHeaderProps {
    name: string;
    image?: string;
    online: boolean;
    lastSeen: string;
    chatId: string;
    userId: string; // Add userId prop
    onDeleteChat: () => void; // Función para abrir el modal de confirmación desde el componente principal
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
    name,
    image,
    online,
    lastSeen,
    userId, // Use userId prop
    onDeleteChat,
}) => {
    const { socket } = useSocket();
    const [isOnline, setIsOnline] = useState(online);
    const [lastSeenTime, setLastSeenTime] = useState(lastSeen);

    useEffect(() => {
        const fetchUserStatus = async () => {
            try {
                const status = await getUserStatus(userId); // Use userId
                setIsOnline(status.isOnline);
                setLastSeenTime(status.lastSeen);
            } catch (error) {
                console.error("Error fetching user status:", error);
            }
        };

        fetchUserStatus();

        if (!socket) return;

        const handleUserStatus = (data: {
            userId: string;
            isOnline: boolean;
            lastSeen: string;
        }) => {
            if (data.userId === userId) {
                // Use userId
                setIsOnline(data.isOnline);
                setLastSeenTime(data.lastSeen);
            }
        };

        socket.on("userStatus", handleUserStatus);

        return () => {
            socket.off("userStatus", handleUserStatus);
        };
    }, [socket, userId]); // Use userId

    return (
        <div>
            {/* Header del chat con iconos y detalles */}
            <div className="bg-white dark:bg-gray-800 p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 shadow-md">
                <div className="flex items-center gap-3">
                    <img
                        src={image}
                        alt={name}
                        className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-700"
                    />
                    <div>
                        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                            {name}
                        </h2>
                        <p
                            className="text-sm"
                            style={{ color: isOnline ? "green" : "gray" }}>
                            {isOnline
                                ? "En línea"
                                : `Última vez: ${
                                      lastSeenTime || "Desconocido"
                                  }`}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {/* Botón para abrir el modal de confirmación */}
                    <button
                        onClick={onDeleteChat} // Llama a la función pasada como prop
                        className="p-2 bg-red-500 text-white rounded-full transition-colors hover:bg-red-600">
                        <Trash2 className="h-5 w-5" />
                    </button>
                    {/* Otros botones (ej. ShieldAlert, Lock, Archive) */}
                    <button className="p-2 bg-yellow-500 text-white rounded-full transition-colors hover:bg-yellow-600">
                        <ShieldAlert className="h-5 w-5" />
                    </button>
                    <button className="p-2 bg-blue-500 text-white rounded-full transition-colors hover:bg-blue-600">
                        <Lock className="h-5 w-5" />
                    </button>
                    <button className="p-2 bg-green-500 text-white rounded-full transition-colors hover:bg-green-600">
                        <Archive className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;
