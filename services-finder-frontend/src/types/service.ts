// Interfaz para la estructura del servicio que devuelve el servidor
export interface Service {
    _id: string;
    id: number;
    title: string;
    description: string;
    price: number;
    duration: string;
    category: string;
    provider: {
        username: string;
    };
    portfolio: string;
}

// Interfaz para el objeto de datos que se enviará al crear un servicio
export interface CreateServiceData {
    title: string;
    description: string;
    price: number;
    duration: string;
    category: string;
}
