import { User } from "./users";

// Tipo para representar un mensaje en el chat
export interface ChatMessage {
    _id: string;
    text: string;
    sentBy: string | User;
    time: string;
}


// Tipo para la respuesta del chat
export interface ChatResponse {
    _id: string;
    clientId: User; // ID del cliente como objeto User
    providerId: User; // ID del proveedor como objeto User
    portfolioId: string;
    messages: ChatMessage[];
    unreadByProvider: boolean;
    status: "pending" | "accepted" | "rejected";
    __v?: number;
}

export interface ChatForm {
    initialMessage: string;
}