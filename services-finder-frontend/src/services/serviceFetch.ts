import { Service } from "../types/service";

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
