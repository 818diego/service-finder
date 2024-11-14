import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import ChatHeader from "../../../components/ChatComponents/ChatHeader";
import ChatList from "../../../components/ChatComponents/ChatList";
import ChatMessage from "../../../components/ChatComponents/ChatMessage";
import ChatInput from "../../../components/ChatComponents/ChatInput";
import {
    getUserStatus,
    fetchChatById,
    sendMessage,
    updateChatStatus,
    deleteChat, // Importamos deleteChat aquí
} from "../../../services/chatsFetch";
import { ChatResponse } from "../../../types/chats";

interface DecodedToken {
    _id: string;
    userType: "Proveedor" | "Cliente";
}

const MyChatsPage: React.FC = () => {
    const [selectedChat, setSelectedChat] = useState<ChatResponse | null>(null);
    const [onlineStatus, setOnlineStatus] = useState({
        online: false,
        lastSeen: "",
    });
    const [messageText, setMessageText] = useState("");
    const [userType, setUserType] = useState<"Proveedor" | "Cliente">(
        "Cliente"
    );
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Decode the token to get userType and userId when the component mounts
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            try {
                const decoded: DecodedToken = jwtDecode(token);
                setUserType(decoded.userType);
                setCurrentUserId(decoded._id);
            } catch (error) {
                console.error("Failed to decode token:", error);
            }
        }
    }, []);

    const handleSelectChat = async (id: string) => {
        try {
            const chat = await fetchChatById(id);
            setSelectedChat(chat);

            const userId =
                chat.clientId._id && chat.clientId._id !== currentUserId
                    ? chat.clientId._id
                    : chat.providerId._id;
            if (userId) {
                const status = await getUserStatus(userId);
                setOnlineStatus({
                    online: status.online,
                    lastSeen: status.lastSeen,
                });
            }
        } catch (error) {
            console.error("Error loading selected chat:", error);
        }
    };

    const handleUpdateChatStatus = async (action: "accept" | "reject") => {
        const token = localStorage.getItem("authToken");
        if (!token || !selectedChat) return;

        try {
            await updateChatStatus(selectedChat._id, action, token);
            setSelectedChat((prevChat) =>
                prevChat
                    ? {
                          ...prevChat,
                          status: action === "accept" ? "accepted" : "rejected",
                      }
                    : null
            );
        } catch (error) {
            console.error(`Error ${action}ing chat:`, error);
        }
    };

    const handleSendMessage = async () => {
        if (!messageText.trim() || !selectedChat) return;

        const token = localStorage.getItem("authToken");
        if (!token) {
            console.error("Token not found");
            return;
        }

        try {
            const sentMessage = await sendMessage(
                selectedChat._id,
                messageText,
                token
            );

            setSelectedChat((prevChat) =>
                prevChat
                    ? {
                          ...prevChat,
                          messages: [
                              ...prevChat.messages,
                              {
                                  _id: sentMessage._id,
                                  text: sentMessage.text,
                                  sentBy: sentMessage.sentBy,
                                  time: sentMessage.time,
                              },
                          ],
                      }
                    : null
            );

            setMessageText("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleDeleteChat = async () => {
        if (!selectedChat) return;
    
        const token = localStorage.getItem("authToken");
        if (!token) {
            console.error("No se encontró el token de autenticación.");
            return;
        }
    
        console.log("Attempting to delete chat with ID:", selectedChat._id); // Verifica el chatId aquí
    
        try {
            await deleteChat(selectedChat._id, token);
            setSelectedChat(null); // Deselecciona el chat después de la eliminación
            setShowConfirmModal(false); // Cierra el modal de confirmación
        } catch (error) {
            console.error("Error eliminando el chat:", error);
        }
    };
    

    // Open and close modal functions
    const openConfirmModal = () => setShowConfirmModal(true);
    const closeConfirmModal = () => setShowConfirmModal(false);

    return (
        <div className="flex justify-center items-center h-[85vh] bg-gray-100 dark:bg-gray-900 px-1">
            <div className="flex h-full w-full bg-white dark:bg-gray-800 rounded-lg">
                <ChatList onSelectChat={handleSelectChat} />

                <div className="flex-1 flex flex-col">
                    {selectedChat ? (
                        <>
                            <ChatHeader
                                name={
                                    selectedChat.clientId.username ||
                                    selectedChat.providerId.username
                                }
                                online={onlineStatus.online}
                                lastSeen={onlineStatus.lastSeen}
                                onDeleteChat={openConfirmModal}
                                chatId={selectedChat._id}
                            />

                            {/* Modal de confirmación de eliminación */}
                            {showConfirmModal && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md">
                                        <p className="text-gray-800 dark:text-gray-100 mb-4">
                                            ¿Estás seguro de que deseas eliminar
                                            este chat?
                                        </p>
                                        <div className="flex justify-end gap-4">
                                            <button
                                                onClick={closeConfirmModal}
                                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors">
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={handleDeleteChat}
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors">
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Accept/Reject Options for Provider */}
                            {userType === "Proveedor" &&
                                selectedChat.status === "pending" && (
                                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md shadow-md mb-2 mx-4">
                                        <p className="text-gray-800 dark:text-gray-200 mb-2">
                                            Este chat está pendiente. ¿Deseas
                                            aceptar o rechazar la solicitud?
                                        </p>
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() =>
                                                    handleUpdateChatStatus(
                                                        "accept"
                                                    )
                                                }
                                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors">
                                                Aceptar
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleUpdateChatStatus(
                                                        "reject"
                                                    )
                                                }
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors">
                                                Rechazar
                                            </button>
                                        </div>
                                    </div>
                                )}

                            <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                                {selectedChat.messages.map((msg) => {
                                    const senderRole =
                                        msg.sentBy === selectedChat.clientId._id
                                            ? "client"
                                            : "provider";
                                    const sentByUser =
                                        msg.sentBy === currentUserId;
                                    const formattedTime = new Date(
                                        msg.time
                                    ).toLocaleTimeString();

                                    return (
                                        <ChatMessage
                                            key={msg._id}
                                            text={msg.text}
                                            time={formattedTime}
                                            sentByUser={sentByUser}
                                            chatStatus={selectedChat.status}
                                            senderRole={senderRole}
                                            currentUserRole={userType.toLowerCase() as "client" | "provider"}
                                        />
                                    );
                                })}
                            </div>

                            <ChatInput
                                userType={userType}
                                messageText={messageText}
                                onMessageChange={(e) =>
                                    setMessageText(e.target.value)
                                }
                                onSendMessage={handleSendMessage}
                            />
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500 dark:text-gray-400">
                                Selecciona un chat para comenzar
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyChatsPage;
