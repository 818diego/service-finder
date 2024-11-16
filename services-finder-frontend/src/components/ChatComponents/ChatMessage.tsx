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
    // Determine if the message was sent by the current user
    const isCurrentUser = sentBy === currentUserType;

    return (
        <div
            className={`w-fit max-w-[35%] min-w-[100px] p-3 transition-opacity duration-300 rounded-lg mb-2 relative ${
                isStatusMessage
                    ? `mx-auto text-center ${statusMessageStyle}`
                    : isCurrentUser
                    ? "ml-auto bg-blue-500 text-white"
                    : "mr-auto bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            }`}>
            <div className="flex flex-col">
                <p className="text-sm leading-relaxed mb-1 break-words">
                    {text}
                </p>
                {!isStatusMessage && (
                    <span className="text-[10px] text-gray-400 dark:text-gray-300 absolute bottom-1 right-2">
                        {time}
                    </span>
                )}
            </div>
        </div>
    );
};

export default ChatMessage;
