import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import ChatHeader from "../../../components/ChatComponents/ChatHeader";
import ChatList from "../../../components/ChatComponents/ChatList";
import ChatMessage from "../../../components/ChatComponents/ChatMessage";
import ChatInput from "../../../components/ChatComponents/ChatInput";
import { chats as initialChats } from "../../../data/chats";
interface DecodedToken {
    userType: "Proveedor" | "Cliente";
}

const MyChatsPage: React.FC = () => {
    const [chats, setChats] = useState(initialChats);
    const [selectedChatId, setSelectedChatId] = useState(chats[0].id);
    const [messageText, setMessageText] = useState("");
    const [userType, setUserType] = useState<"Proveedor" | "Cliente">(
        "Cliente"
    );

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            try {
                const decoded: DecodedToken = jwtDecode(token);
                setUserType(decoded.userType);
            } catch (error) {
                console.error("Failed to decode token:", error);
            }
        }
    }, []);

    const selectedChat = chats.find((chat) => chat.id === selectedChatId);

    const handleSelectChat = (id: number) => {
        setSelectedChatId(id);
    };

    const handleSendMessage = () => {
        if (messageText.trim() === "" || !selectedChat) return;

        const newMessage = {
            text: messageText,
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
            sentByUser: true,
        };

        const updatedChats = chats.map((chat) =>
            chat.id === selectedChatId
                ? {
                      ...chat,
                      messages: [...chat.messages, newMessage],
                      lastMessage: newMessage.text,
                      time: newMessage.time,
                  }
                : chat
        );

        setChats(updatedChats);
        setMessageText("");
    };

    return (
        <div className="flex justify-center items-center h-[88vh] bg-gray-100 dark:bg-gray-900 px-1">
            <div className="flex h-full w-full bg-white dark:bg-gray-800 rounded-lg">
                <ChatList onSelectChat={handleSelectChat} />
                <div className="flex-1 flex flex-col">
                    {selectedChat && (
                        <>
                            <ChatHeader
                                name={selectedChat.name}
                                image={selectedChat.image}
                                online={selectedChat.online}
                            />
                            <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                                {selectedChat.messages.map((msg, index) => (
                                    <ChatMessage
                                        key={index}
                                        text={msg.text}
                                        time={msg.time}
                                        sentByUser={msg.sentByUser}
                                    />
                                ))}
                            </div>
                            <ChatInput
                                userType={userType}
                                messageText={messageText}
                                onMessageChange={(e) =>
                                    setMessageText(e.target.value)
                                }
                                onSendMessage={handleSendMessage}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyChatsPage;
