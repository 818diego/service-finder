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
}

export const createService = async (data: {
    title: string;
    description: string;
    price: number;
    duration: string;
    category: string;
}) => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No token available");
    }

    try {
        const response = await fetch(
            "http://localhost:3000/api/services/create",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(data),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }

        const result = await response.json();
        console.log("Service created successfully:", result);
        
        // Retornamos el resultado, que contiene el portfolioId
        return result; // result debería contener el portfolioId en su estructura de datos
    } catch (error) {
        console.error("Error creating service:", error);
        throw error;
    }
};


export const fetchServices = async (): Promise<Service[]> => {
    const response = await fetch("http://localhost:3000/api/services/list");
    if (!response.ok) {
        throw new Error("Error al obtener los servicios");
    }
    return response.json();
};

export const createPost = async (
    portfolioId: string,
    data: { title: string; description: string; images: string[] }
) => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No token available");
    }

    try {
        const response = await fetch(
            `http://localhost:3000/api/post/portfolio/${portfolioId}/add-create-posts`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(data),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }

        const result = await response.json();
        console.log("Post created successfully:", result);
        return result;
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
};

export const createServiceAndAddPost = async (
    serviceData: { title: string; description: string; price: number; duration: string; category: string },
    postData: { title: string; description: string; images: string[] }
) => {
    try {
        // Primero, creamos el servicio y obtenemos el portfolioId
        const serviceResult = await createService(serviceData);
        const portfolioId = serviceResult.portfolioId; // Obtén el portfolioId del resultado

        // Ahora creamos el post usando el portfolioId obtenido
        const postResult = await createPost(portfolioId, postData);
        
        console.log("Service and post created successfully:", { serviceResult, postResult });
        return { serviceResult, postResult };
    } catch (error) {
        console.error("Error creating service and post:", error);
        throw error;
    }
};

