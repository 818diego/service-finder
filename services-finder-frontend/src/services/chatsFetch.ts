import { ChatResponse } from "../types/chats";

//Crear un chat
export const createChat = async (
    portfolioId: string,
    initialMessage: string,
    token: string
) => {
    try {
        const response = await fetch("http://localhost:3000/api/chats/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ portfolioId, initialMessage }), // Enviar initialMessage en el cuerpo
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.message || response.statusText;
            throw new Error(`Error creating chat: ${errorMessage}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error creating chat:", error);
        throw error;
    }
};

//Obtener los chats del usuario
export const fetchUserChats = async (): Promise<ChatResponse[]> => {
    try {
        const token = localStorage.getItem("authToken");

        if (!token) {
            throw new Error("Token no encontrado. Por favor inicie sesión.");
        }

        const response = await fetch(
            `http://localhost:3000/api/chats/user-chats`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error("Error al obtener los chats del usuario");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en fetchUserChats:", error);
        throw error;
    }
};

//Obtener el Status de un usuario del chat
export const getUserStatus = async (userId: string) => {
    try {
        const token = localStorage.getItem("authToken");

        if (!token) {
            throw new Error("Token no encontrado. Por favor inicie sesión.");
        }

        const response = await fetch(
            `http://localhost:3000/api/chats/status/${userId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.message || response.statusText;
            throw new Error(
                `Error al obtener el estado del usuario: ${errorMessage}`
            );
        }

        return await response.json();
    } catch (error) {
        console.error("Error al obtener el estado del usuario:", error);
        throw error;
    }
};

//Obtener un chat por ID
export const fetchChatById = async (id: string): Promise<ChatResponse> => {
    console.log("Fetching chat with ID:", id); // Debug
    const token = localStorage.getItem("authToken");

    const response = await fetch(`http://localhost:3000/api/chats/${id}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Error al obtener el chat");
    }

    const chatData = await response.json();
    console.log("Chat data fetched:", chatData); // Debug
    return chatData;
};

//Enviar un mensaje a un chat específico
export const sendMessage = async (
    chatId: string,
    text: string,
    token: string
) => {
    try {
        const response = await fetch(
            `http://localhost:3000/api/chats/send-message`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ chatId, text }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.message || response.statusText;
            throw new Error(`Error sending message: ${errorMessage}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
};

//Actualizar el estado de un chat
export const updateChatStatus = async (
    chatId: string,
    action: "accept" | "reject",
    token: string
) => {
    try {
        const response = await fetch(
            `http://localhost:3000/api/chats/update-status/${chatId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ action }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.message || response.statusText;
            throw new Error(`Error updating chat status: ${errorMessage}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error updating chat status:", error);
        throw error;
    }
};

//Eliminar un chat por ID
export const deleteChat = async (chatId: string, token: string) => {
    try {
        const response = await fetch(
            `http://localhost:3000/api/chats/delete/${chatId}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.message || response.statusText;
            throw new Error(`Error deleting chat: ${errorMessage}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error deleting chat:", error);
        throw error;
    }
}
