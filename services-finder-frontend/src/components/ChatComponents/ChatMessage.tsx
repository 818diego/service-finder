import React, { useEffect, useState } from "react";

interface ChatMessageProps {
    text: string;
    time: string;
    sentByUser: boolean;
    chatStatus: "pending" | "accepted" | "rejected";
    senderRole: "provider" | "client";
    currentUserRole: "provider" | "client";
}

const ChatMessage: React.FC<ChatMessageProps> = ({
    text,
    time,
    senderRole,
    currentUserRole,
}) => {
    const [animate, setAnimate] = useState(true);

    useEffect(() => {
        setAnimate(true);
        const timer = setTimeout(() => setAnimate(false), 300);
        return () => clearTimeout(timer);
    }, [text, time]);

    // Determine if the message is sent by the current user
    const isCurrentUser = senderRole === currentUserRole;

    return (
        <div
            className={`w-fit max-w-[70%] p-3 transition-opacity duration-300 rounded-2xl mb-2 shadow-sm ${
                isCurrentUser
                    ? "ml-auto bg-gradient-to-r from-blue-500 to-blue-700 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            } ${animate ? "fade-in" : ""}`}>
            <p>{text}</p>
            <span className="text-xs text-gray-400 dark:text-gray-300 block mt-1 text-right">
                {time}
            </span>
        </div>
    );
};

export default ChatMessage;
