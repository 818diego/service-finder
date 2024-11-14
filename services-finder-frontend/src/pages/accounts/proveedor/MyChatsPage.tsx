// src/pages/MyChatsPage.tsx
import React, { useState, useEffect, useRef } from "react";
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
    deleteChat,
} from "../../../services/chatsFetch";
import { ChatResponse } from "../../../types/chats";
import { useSocket } from "../../../Context/SocketContext";

interface DecodedToken {
    _id: string;
    userType: "Proveedor" | "Cliente";
}

const MyChatsPage: React.FC = () => {
    const { socket } = useSocket(); // Obtén el socket desde el contexto
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
    const chatEndRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        if (!socket) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleReceiveMessage = (data: any) => {
            if (data.chatId === selectedChat?._id) {
                setSelectedChat((prevChat) =>
                    prevChat
                        ? {
                              ...prevChat,
                              messages: [
                                  ...prevChat.messages,
                                  {
                                      _id: data.message._id,
                                      text: data.message.text,
                                      sentBy: data.senderId,
                                      time: data.message.time,
                                  },
                              ],
                          }
                        : null
                );
            }
        };

        const handleUserStatus = (data: {
            userId: string;
            online: boolean;
            lastSeen: string;
        }) => {
            if (
                selectedChat &&
                (data.userId === selectedChat.clientId._id ||
                    data.userId === selectedChat.providerId._id)
            ) {
                setOnlineStatus({
                    online: data.online,
                    lastSeen: data.lastSeen,
                });
            }
        };

        socket.on("receiveMessage", handleReceiveMessage);
        socket.on("userStatus", handleUserStatus);

        // Cleanup
        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
            socket.off("userStatus", handleUserStatus);
        };
    }, [
        socket,
        selectedChat?._id,
        selectedChat?.clientId._id,
        selectedChat?.providerId._id,
    ]);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [selectedChat?.messages]);

    const handleSelectChat = async (id: string) => {
        try {
            if (selectedChat) {
                socket?.emit("leaveChat", { chatId: selectedChat._id });
            }

            const chat = await fetchChatById(id);
            setSelectedChat(chat);

            socket?.emit("joinChat", { chatId: id });

            const userId =
                chat.clientId._id && chat.clientId._id !== currentUserId
                    ? chat.clientId._id
                    : chat.providerId._id;
            if (userId) {
                const status = await getUserStatus(userId);
                setOnlineStatus({
                    online: status.isOnline,
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
            const message =
                action === "accept"
                    ? "El proveedor ha aceptado el chat."
                    : "El proveedor ha rechazado el chat.";
            await sendMessage(selectedChat._id, message, token);
            if (action === "reject") {
                setSelectedChat(null); // Deselect chat if rejected
            }
        } catch (error) {
            console.error(`Error ${action}ing chat:`, error);
        }
    };

    const handleSendMessage = async () => {
        if (!messageText.trim() || !selectedChat) return;

        const token = localStorage.getItem("authToken");
        if (!token) {
            console.error("Token no encontrado");
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

            // Emitir el mensaje al servidor
            socket?.emit("sendMessage", {
                chatId: selectedChat._id,
                message: sentMessage,
            });
        } catch (error) {
            console.error("Error al enviar el mensaje:", error);
        }
    };

    const handleDeleteChat = async () => {
        if (!selectedChat) return;

        const token = localStorage.getItem("authToken");
        if (!token) {
            console.error("No se encontró el token de autenticación.");
            return;
        }

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
                                userId={
                                    selectedChat.clientId._id !== currentUserId
                                        ? selectedChat.clientId._id || ""
                                        : selectedChat.providerId._id || ""
                                }
                            />
                            {showConfirmModal && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
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
                            <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50 dark:bg-gray-900 relative">
                                {selectedChat.messages.map((msg) => {
                                    const sentBy =
                                        msg.sentBy === selectedChat.clientId._id
                                            ? "Cliente"
                                            : "Proveedor";
                                    const formattedTime = new Date(
                                        msg.time
                                    ).toLocaleTimeString();
                                    const isStatusMessage =
                                        msg.text.includes(
                                            "El proveedor ha aceptado el chat."
                                        ) ||
                                        msg.text.includes(
                                            "El proveedor ha rechazado el chat."
                                        );
                                    const statusMessageStyle =
                                        msg.text.includes("aceptado")
                                            ? "text-green-600"
                                            : "text-red-600";

                                    return (
                                        <ChatMessage
                                            key={msg._id}
                                            text={msg.text}
                                            time={formattedTime}
                                            sentBy={sentBy}
                                            chatStatus={selectedChat.status}
                                            currentUserType={userType}
                                            isStatusMessage={isStatusMessage}
                                            statusMessageStyle={
                                                statusMessageStyle
                                            }
                                        />
                                    );
                                })}
                                <div ref={chatEndRef} />
                            </div>
                            {selectedChat.status === "pending" &&
                                userType === "Cliente" && (
                                    <div className="p-4 bg-yellow-400 dark:bg-yellow-600 text-black dark:text-white rounded-lg shadow-lg text-center">
                                        Debes esperar a que el proveedor acepte
                                        el chat antes de poder enviar mensajes.
                                    </div>
                                )}
                            {userType === "Proveedor" &&
                                selectedChat.status === "pending" && (
                                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center gap-4 z-10">
                                        <p className="text-gray-800 dark:text-gray-200">
                                            Este chat está pendiente. ¿Deseas
                                            aceptar o rechazar la solicitud?
                                        </p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    handleUpdateChatStatus(
                                                        "accept"
                                                    )
                                                }
                                                className="bg-green-500 text-white px-4 py-2 rounded-full transition-colors hover:bg-green-600">
                                                Aceptar
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleUpdateChatStatus(
                                                        "reject"
                                                    )
                                                }
                                                className="bg-red-500 text-white px-4 py-2 rounded-full transition-colors hover:bg-red-600">
                                                Rechazar
                                            </button>
                                        </div>
                                    </div>
                                )}
                            <ChatInput
                                userType={userType}
                                messageText={messageText}
                                onMessageChange={(e) =>
                                    setMessageText(e.target.value)
                                }
                                onSendMessage={handleSendMessage}
                                disabled={selectedChat.status !== "accepted"}
                            />
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-gray-700 dark:text-gray-300 mb-4">
                                    Bienvenido
                                </div>
                                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                    Selecciona un chat para comenzar
                                </p>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Elige una conversación de la lista para ver
                                    los mensajes.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyChatsPage;
