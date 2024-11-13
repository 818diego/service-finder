import React, { ChangeEvent, useState } from "react";
import {
    Plus,
    Send,
    FileText,
    Image,
    File,
    Video,
    DollarSign,
    CheckCircle,
} from "lucide-react";

interface ChatInputProps {
    userType: "Proveedor" | "Cliente"; // Ensure `userType` is defined
    messageText: string;
    onMessageChange: (e: ChangeEvent<HTMLInputElement>) => void; // Define the type of `e`
    onSendMessage: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
    userType,
    messageText,
    onMessageChange,
    onSendMessage,
}) => {
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);

    return (
        <div className="bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2 relative shadow-md">
            <button
                onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                <Plus className="h-4 w-4 text-gray-800 dark:text-gray-100" />
            </button>

            {/* Options based on userType */}
            {isOptionsOpen && (
                <div className="absolute bottom-14 left-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-lg p-2 animate-fade-in">
                    {userType === "Proveedor" ? (
                        <>
                            <button className="flex items-center w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                                <File className="h-4 w-4 mr-2 text-gray-800 dark:text-gray-100" />
                                Enviar archivo
                            </button>
                            <button className="flex items-center w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                                <Video className="h-4 w-4 mr-2 text-gray-800 dark:text-gray-100" />
                                Enviar video
                            </button>
                            <button className="flex items-center w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                                <Image className="h-4 w-4 mr-2 text-gray-800 dark:text-gray-100" />
                                Enviar imagen
                            </button>
                            <button className="flex items-center w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                                <DollarSign className="h-4 w-4 mr-2 text-gray-800 dark:text-gray-100" />
                                Solicitar pago
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="flex items-center w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                                <FileText className="h-4 w-4 mr-2 text-gray-800 dark:text-gray-100" />
                                Enviar propuesta
                            </button>
                            <button className="flex items-center w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                                <CheckCircle className="h-4 w-4 mr-2 text-gray-800 dark:text-gray-100" />
                                Marcar como finalizado
                            </button>
                            <button className="flex items-center w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                                <Image className="h-4 w-4 mr-2 text-gray-800 dark:text-gray-100" />
                                Enviar imagen
                            </button>
                        </>
                    )}
                </div>
            )}

            <input
                type="text"
                placeholder="Escribe un mensaje..."
                className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-full px-4 py-2 focus:outline-none shadow-inner"
                value={messageText}
                onChange={onMessageChange}
            />
            <button
                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
                onClick={onSendMessage}>
                <Send className="h-5 w-5" />
            </button>
        </div>
    );
};

export default ChatInput;
