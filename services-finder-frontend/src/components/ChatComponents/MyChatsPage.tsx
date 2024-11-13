import React, { useState } from "react";
import ChatHeader from "../ChatComponents/ChatHeader";
import ChatList from "../ChatComponents/ChatList";
import ChatMessage from "../ChatComponents/ChatMessage";
import ChatInput from "../ChatComponents/ChatInput";
import { chats } from "../../data/chats";

const MyChatsPage: React.FC = () => {
    const [selectedChat, setSelectedChat] = useState(chats[0]);

    const handleSelectChat = (id: number) => {
        const chat = chats.find((chat) => chat.id === id);
        setSelectedChat(chat || chats[0]);
    };

    return (
        <div className="flex justify-center items-center h-[85vh] bg-gray-100 dark:bg-gray-900 px-1">
            <div className="flex h-full w-full bg-white dark:bg-gray-800 rounded-lg">
                <ChatList onSelectChat={handleSelectChat} />
                <div className="flex-1 flex flex-col">
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
                    <ChatInput />
                </div>
            </div>
        </div>
    );
};

export default MyChatsPage;
