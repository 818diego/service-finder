import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { ChatResponse, ChatMessage } from "../../types/chats";
import { jwtDecode } from "jwt-decode";
import { fetchUserChats } from "../../services/chatsFetch";

interface ChatListProps {
    onSelectChat: (id: string) => void; // Cambiamos para pasar solo el id
}

interface DecodedToken {
    userId: string;
    username: string;
    userType: string;
}

const ChatList: React.FC<ChatListProps> = ({ onSelectChat }) => {
    const [chats, setChats] = useState<ChatResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [userInfo, setUserInfo] = useState<DecodedToken | null>(null);

    const getUserInfoFromToken = (): DecodedToken | null => {
        const token = localStorage.getItem("authToken");
        if (!token) return null;

        try {
            return jwtDecode<DecodedToken>(token);
        } catch (error) {
            console.error("Error al decodificar el token:", error);
            return null;
        }
    };

    useEffect(() => {
        const user = getUserInfoFromToken();
        if (user) {
            setUserInfo(user);
            fetchUserChats()
                .then(setChats)
                .catch((error) =>
                    console.error("Error al obtener los chats:", error)
                );
        }
    }, []);

    const filteredChats = chats.filter((chat) => {
        const displayName =
            userInfo?.userType === "Proveedor"
                ? chat.clientId.username
                : chat.providerId.username;
        return displayName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const getChatDisplayData = (chat: ChatResponse) => {
        const lastMessage: ChatMessage | undefined =
            chat.messages[chat.messages.length - 1];
        const displayName =
            userInfo?.userType === "Proveedor"
                ? chat.clientId.username
                : chat.providerId.username;
        const lastMessageText = lastMessage
            ? lastMessage.text
            : "No hay mensajes";
        const time = lastMessage
            ? new Date(lastMessage.time).toLocaleTimeString()
            : "";

        return { displayName, lastMessageText, time };
    };

    return (
        <div className="w-1/4 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
            <div className="p-[18px] border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar cliente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-100 rounded-full px-4 py-2 focus:outline-none"
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto mt-4">
                {filteredChats.map((chat) => {
                    const { displayName, lastMessageText, time } =
                        getChatDisplayData(chat);
                    return (
                        <div
                            key={chat._id}
                            onClick={() => {
                                console.log(
                                    "Chat seleccionado con ID:",
                                    chat._id
                                );
                                onSelectChat(chat._id); // Pasamos solo el id del chat
                            }}
                            className="flex items-center gap-3 p-3 cursor-pointer transition-colors rounded-md mx-2
                                       hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-sm">
                            <img
                                src="/src/assets/images/1.jpg"
                                alt={displayName}
                                className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-700"
                            />
                            <div className="flex-1">
                                <h3 className="font-medium text-gray-800 dark:text-gray-100">
                                    {displayName}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                    {lastMessageText}
                                </p>
                            </div>
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                {time}
                            </span>
                        </div>
                    );
                })}
                {filteredChats.length === 0 && (
                    <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
                        No se encontraron chats pendientes
                    </p>
                )}
            </div>
        </div>
    );
};

export default ChatList;
