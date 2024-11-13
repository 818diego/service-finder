export interface Service {
    title: string;
    description: string;
    price: number;
    images: string[];
    portfolio: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface ServiceForm {
    title: string;
    description: string;
    portfolio: string;
    price: number;
    category: string;
    images?: File[];
    removeImageUrls?: string[];
}

