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
    disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
    userType,
    messageText,
    onMessageChange,
    onSendMessage,
    disabled,
}) => {
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);

    return (
        <div className="bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2 relative shadow-md">
            <button
                onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                className="p-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-full transition-colors hover:bg-gray-400 dark:hover:bg-gray-600"
                disabled={disabled}>
                <Plus className="h-4 w-4" />
            </button>

            {/* Options based on userType */}
            {isOptionsOpen && !disabled && (
                <div className="absolute bottom-14 left-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-lg p-2 animate-fade-in">
                    {userType === "Proveedor" ? (
                        <>
                            <button className="flex items-center w-full p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded transition-colors hover:bg-gray-200 dark:hover:bg-gray-600">
                                <File className="h-4 w-4 mr-2" />
                                Enviar archivo
                            </button>
                            <button className="flex items-center w-full p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded transition-colors hover:bg-gray-200 dark:hover:bg-gray-600">
                                <Video className="h-4 w-4 mr-2" />
                                Enviar video
                            </button>
                            <button className="flex items-center w-full p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded transition-colors hover:bg-gray-200 dark:hover:bg-gray-600">
                                <Image className="h-4 w-4 mr-2" />
                                Enviar imagen
                            </button>
                            <button className="flex items-center w-full p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded transition-colors hover:bg-gray-200 dark:hover:bg-gray-600">
                                <DollarSign className="h-4 w-4 mr-2" />
                                Solicitar pago
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="flex items-center w-full p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded transition-colors hover:bg-gray-200 dark:hover:bg-gray-600">
                                <FileText className="h-4 w-4 mr-2" />
                                Enviar propuesta
                            </button>
                            <button className="flex items-center w-full p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded transition-colors hover:bg-gray-200 dark:hover:bg-gray-600">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Marcar como finalizado
                            </button>
                            <button className="flex items-center w-full p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded transition-colors hover:bg-gray-200 dark:hover:bg-gray-600">
                                <Image className="h-4 w-4 mr-2" />
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
                disabled={disabled}
            />
            <button
                className="p-2 bg-blue-500 text-white rounded-full transition-colors hover:bg-blue-600"
                onClick={onSendMessage}
                disabled={disabled}>
                <Send className="h-5 w-5" />
            </button>
        </div>
    );
};

export default ChatInput;
