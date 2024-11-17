export interface OfferForm {
    title: string;
    description: string;
    category: string;
    budget: number;
    status: string;
    images: string[];
    removeImageUrls?: string[];
    files?: File[];
}

export interface Offer {
    client: string;
    title: string;
    description: string;
    category: string;
    budget: number;
    status: string;
    images: string[];
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}
