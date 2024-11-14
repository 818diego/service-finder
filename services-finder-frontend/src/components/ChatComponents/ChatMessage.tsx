import React from "react";

interface ChatMessageProps {
    text: string;
    time: string;
    sentBy: "Cliente" | "Proveedor";
    chatStatus: "pending" | "accepted" | "rejected";
    currentUserType: "Proveedor" | "Cliente";
    isStatusMessage?: boolean;
    statusMessageStyle?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
    text,
    time,
    sentBy,
    currentUserType,
    isStatusMessage = false,
    statusMessageStyle = "",
}) => {
    // Determina si el mensaje fue enviado por el usuario actual
    const isCurrentUser = sentBy === currentUserType;

    return (
        <div
            className={`w-fit max-w-[70%] p-4 transition-opacity duration-300 rounded-2xl mb-2 ${
                isStatusMessage
                    ? `mx-auto text-center ${statusMessageStyle}`
                    : isCurrentUser
                    ? "ml-auto bg-blue-500 text-white"
                    : "mr-auto bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            }`}>
            <p className="text-sm leading-relaxed">{text}</p>
            {!isStatusMessage && (
                <span className="text-xs text-gray-400 dark:text-gray-300 block mt-2 text-right">
                    {time}
                </span>
            )}
        </div>
    );
};

export default ChatMessage;
