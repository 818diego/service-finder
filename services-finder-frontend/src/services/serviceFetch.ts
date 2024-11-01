import { Service, CreateServiceData } from "../types/service";

export const createService = async (
    data: CreateServiceData
): Promise<Service> => {
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

        const result: Service = await response.json();
        console.log("Service created successfully:", result);
        return result;
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
