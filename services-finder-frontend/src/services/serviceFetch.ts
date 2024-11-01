import { Service, CreateServiceData } from "../types/service";

export const fetchServices = async (): Promise<Service[]> => {
    const response = await fetch("http://localhost:3000/api/services/list");
    if (!response.ok) {
        throw new Error("Error al obtener los servicios");
    }
    return response.json();
};

export const fetchUserServices = async (userId: string, token: string) => {
    const response = await fetch(
        `http://localhost:3000/api/services/user/${userId}/services`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        }
    );

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
            `Error fetching services: ${response.status} - ${errorData}`
        );
    }

    return await response.json();
};

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

export const updateService = async (
    serviceId: string,
    data: CreateServiceData
): Promise<Service> => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No token available");
    }

    const response = await fetch(`http://localhost:3000/api/services/update/${serviceId}`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error updating service: ${response.status} - ${errorData}`);
    }

    return await response.json() as Service;
};

export const deleteService = async (serviceId: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No token available");
    }

    const response = await fetch(`http://localhost:3000/api/services/delete/${serviceId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error deleting service: ${response.status} - ${errorData}`);
    }
}

