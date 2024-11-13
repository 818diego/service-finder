import React, { useState } from "react";
import { Search } from "lucide-react";
import { chats as initialChats } from "../../data/chats";

interface ChatListProps {
    onSelectChat: (id: number) => void;
}

const ChatList: React.FC<ChatListProps> = ({ onSelectChat }) => {
    const [searchTerm, setSearchTerm] = useState("");

    // Filter chats based on the search term
    const filteredChats = initialChats.filter((chat) =>
        chat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-1/4 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
            {/* Search Bar */}
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

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto mt-4">
                {filteredChats.map((chat) => (
                    <div
                        key={chat.id}
                        onClick={() => onSelectChat(chat.id)}
                        className="flex items-center gap-3 p-3 cursor-pointer transition-colors rounded-md mx-2
                                   hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-sm">
                        <img
                            src={chat.image}
                            alt={chat.name}
                            className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-700"
                        />
                        <div className="flex-1">
                            <h3 className="font-medium text-gray-800 dark:text-gray-100">
                                {chat.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {chat.lastMessage}
                            </p>
                        </div>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                            {chat.time}
                        </span>
                    </div>
                ))}
                {filteredChats.length === 0 && (
                    <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
                        No se encontraron resultados
                    </p>
                )}
            </div>
        </div>
    );
};

export default ChatList;
