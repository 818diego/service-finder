import React, {
    ChangeEvent,
    useState,
    KeyboardEvent,
    useEffect,
    useRef,
} from "react";
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
    userType: "Proveedor" | "Cliente";
    messageText: string;
    onMessageChange: (e: ChangeEvent<HTMLInputElement>) => void;
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
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !disabled) {
            onSendMessage();
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
        ) {
            setIsOptionsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleFileClick = () => console.log("Enviar archivo");
    const handleVideoClick = () => console.log("Enviar video");
    const handleImageClick = () => console.log("Enviar imagen");
    const handlePaymentRequestClick = () => console.log("Solicitar pago");
    const handleProposalClick = () => console.log("Enviar propuesta");
    const handleMarkAsFinishedClick = () =>
        console.log("Marcar como finalizado");

    return (
        <div className="bg-white dark:bg-gray-800 p-2 sm:p-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2 relative shadow-md">
            <button
                onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                className="p-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-full transition-colors hover:bg-gray-400 dark:hover:bg-gray-600"
                disabled={disabled}>
                <Plus className="h-4 w-4" />
            </button>

            {/* Options based on userType */}
            {isOptionsOpen && !disabled && (
                <div
                    ref={dropdownRef}
                    className="absolute bottom-14 left-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-lg p-2 animate-fade-in">
                    {userType === "Proveedor" ? (
                        <>
                            <button
                                className="flex items-center w-full p-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
                                onClick={handleFileClick}>
                                <File className="h-4 w-4 mr-2" />
                                Enviar archivo
                            </button>
                            <button
                                className="flex items-center w-full p-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
                                onClick={handleVideoClick}>
                                <Video className="h-4 w-4 mr-2" />
                                Enviar video
                            </button>
                            <button
                                className="flex items-center w-full p-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
                                onClick={handleImageClick}>
                                <Image className="h-4 w-4 mr-2" />
                                Enviar imagen
                            </button>
                            <button
                                className="flex items-center w-full p-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
                                onClick={handlePaymentRequestClick}>
                                <DollarSign className="h-4 w-4 mr-2" />
                                Solicitar pago
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className="flex items-center w-full p-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
                                onClick={handleProposalClick}>
                                <FileText className="h-4 w-4 mr-2" />
                                Enviar propuesta
                            </button>
                            <button
                                className="flex items-center w-full p-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
                                onClick={handleMarkAsFinishedClick}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Marcar como finalizado
                            </button>
                            <button
                                className="flex items-center w-full p-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
                                onClick={handleImageClick}>
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
                onKeyPress={handleKeyPress}
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
