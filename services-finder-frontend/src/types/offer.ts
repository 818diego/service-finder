export interface OfferData {
    title: string;
    description: string;
    category: string;
    budget: number;
    status: boolean;
    images: string[];
}

export interface OfferResponse {
    client: string;
    title: string;
    description: string;
    category: string;
    budget: number;
    status: string; // "Activo" o "No disponible"
    images: string[];
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}
