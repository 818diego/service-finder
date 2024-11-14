import React from "react";
import { Trash2, ShieldAlert, Lock, Archive } from "lucide-react";

interface ChatHeaderProps {
    name: string;
    image?: string;
    online: boolean;
    lastSeen: string;
    chatId: string;
    onDeleteChat: () => void; // Función para abrir el modal de confirmación desde el componente principal
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
    name,
    image,
    online,
    lastSeen,
    onDeleteChat,
}) => {
    return (
        <div>
            {/* Header del chat con iconos y detalles */}
            <div className="bg-white dark:bg-gray-800 p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <img
                        src={image}
                        alt={name}
                        className="w-10 h-10 rounded-full"
                    />
                    <div>
                        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                            {name}
                        </h2>
                        <p
                            className="text-sm"
                            style={{ color: online ? "green" : "gray" }}>
                            {online
                                ? "En línea"
                                : `Última vez: ${lastSeen || "Desconocido"}`}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {/* Botón para abrir el modal de confirmación */}
                    <button
                        onClick={onDeleteChat} // Llama a la función pasada como prop
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <Trash2 className="h-5 w-5 text-gray-800 dark:text-gray-100" />
                    </button>
                    {/* Otros botones (ej. ShieldAlert, Lock, Archive) */}
                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <ShieldAlert className="h-5 w-5 text-gray-800 dark:text-gray-100" />
                    </button>
                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <Lock className="h-5 w-5 text-gray-800 dark:text-gray-100" />
                    </button>
                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <Archive className="h-5 w-5 text-gray-800 dark:text-gray-100" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;
