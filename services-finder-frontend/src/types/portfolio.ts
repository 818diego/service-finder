export interface Portfolio {
    image: string;
    _id: string;
    provider: {
        id: string;
        username: string;
    };
    title: string;
    description: string;
    duration: string;
    category: string;
    imagen: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface PortfolioForm {
    title: string;
    description: string;
    duration: string;
    category: string;
    image?: File;
}
