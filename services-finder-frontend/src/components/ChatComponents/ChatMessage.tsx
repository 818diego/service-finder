import React, { useEffect, useState } from "react";

interface ChatMessageProps {
    text: string;
    time: string;
    sentByUser: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
    text,
    time,
    sentByUser,
}) => {
    const [animate, setAnimate] = useState(true);

    // Trigger animation only once on initial render of the component
    useEffect(() => {
        setAnimate(true);
        const timer = setTimeout(() => setAnimate(false), 300); // Animation duration: 300ms
        return () => clearTimeout(timer);
    }, [text, time]); // Re-run only when text or time changes

    return (
        <div
            className={`w-fit max-w-[70%] p-3 ${
                sentByUser
                    ? "ml-auto bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
            } rounded-2xl mb-2 ${animate ? "fade-in" : ""}`}>
            <p>{text}</p>
            <span className="text-xs text-gray-400 dark:text-gray-300 block mt-1 text-right">
                {time}
            </span>
        </div>
    );
};

export default ChatMessage;
