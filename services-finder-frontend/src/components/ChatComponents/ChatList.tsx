import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { ChatResponse, ChatMessage } from "../../types/chats";
import { jwtDecode } from "jwt-decode";
import { fetchUserChats } from "../../services/chatsFetch";
import { useSocket } from "../../Context/SocketContext";

interface ChatListProps {
    onSelectChat: (id: string) => void;
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
    const [unreadMessages, setUnreadMessages] = useState<{
        [key: string]: number;
    }>({});
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const { socket } = useSocket();

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

            if (socket) {
                socket.on("receiveMessage", (data) => {
                    setUnreadMessages((prev) => ({
                        ...prev,
                        [data.chatId]: (prev[data.chatId] || 0) + 1,
                    }));
                    setChats((prevChats) =>
                        prevChats.map((chat) =>
                            chat._id === data.chatId
                                ? {
                                      ...chat,
                                      messages: [
                                          ...chat.messages,
                                          {
                                              _id: data.message._id,
                                              text: data.message.text,
                                              sentBy: data.senderId,
                                              time: data.message.time,
                                          },
                                      ],
                                  }
                                : chat
                        )
                    );
                });

                return () => {
                    socket.off("receiveMessage");
                };
            }
        }
    }, [socket]);

    const handleSelectChat = (id: string) => {
        onSelectChat(id);
        setSelectedChatId(id);
        setUnreadMessages((prev) => ({
            ...prev,
            [id]: 0, // Reset unread messages count when chat is opened
        }));
    };

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
            ? new Date(lastMessage.time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
              })
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
                    const unreadCount = unreadMessages[chat._id] || 0;
                    return (
                        <div
                            key={chat._id}
                            onClick={() => handleSelectChat(chat._id)}
                            className={`flex items-center gap-3 p-3 cursor-pointer transition-colors rounded-md mx-2
                                       hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-sm relative ${
                                           chat._id === selectedChatId
                                               ? "bg-gray-200 dark:bg-gray-700"
                                               : ""
                                       }`}>
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
                            {unreadCount > 0 && chat._id !== selectedChatId && (
                                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
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
