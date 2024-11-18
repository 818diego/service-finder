import React, { useRef, useEffect, useState } from "react";
import { Trash2, ShieldAlert, Lock, Archive } from "lucide-react";
import { useSocket } from "../../Context/SocketContext";
import { getUserStatus } from "../../services/chatsFetch";
import "./ChatHeader.css";

interface ChatHeaderProps {
    name: string;
    image?: string;
    online: boolean;
    lastSeen: string;
    chatId: string;
    userId: string;
    isProvider: boolean;
    onDeleteChat: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
    name,
    image,
    online,
    lastSeen,
    userId,
    onDeleteChat,
}) => {
    const { socket } = useSocket();
    const [isOnline, setIsOnline] = useState(online);
    const [lastSeenTime, setLastSeenTime] = useState(lastSeen);
    const headerRef = useRef<HTMLDivElement>(null);
    const statusRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const fetchUserStatus = async () => {
            try {
                const status = await getUserStatus(userId);
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
                setIsOnline(data.isOnline);
                setLastSeenTime(data.lastSeen);
            }
        };

        socket.on("userStatus", handleUserStatus);

        return () => {
            socket.off("userStatus", handleUserStatus);
        };
    }, [socket, userId]);

    useEffect(() => {
        if (headerRef.current) {
            // Perform any operations with headerRef.current
        }
    }, []);

    return (
        <div ref={headerRef}>
            {/* Header del chat con iconos y detalles */}
            <div className="bg-white dark:bg-gray-800 p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 shadow-md">
                <div className="flex items-center gap-3">
                    <img
                        src={image || "src/assets/images/perfil.png"}
                        alt={name}
                        className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-700"
                    />
                    <div>
                        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                            {name}
                        </h2>
                        <p
                            ref={statusRef}
                            className="text-sm"
                            style={{ color: isOnline ? "green" : "gray" }}>
                            {isOnline
                                ? "En línea"
                                : `Última vez: ${
                                      lastSeenTime
                                          ? lastSeenTime
                                          : "Desconocido"
                                  }`}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {/* Botón para abrir el modal de confirmación */}
                    <button
                        onClick={onDeleteChat}
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
