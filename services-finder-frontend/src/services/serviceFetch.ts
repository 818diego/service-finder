import { Service, ServiceForm } from "../types/service";

const API_URL = import.meta.env.VITE_API_URL;

export const createService = async (
    data: ServiceForm,
    token: string
): Promise<Service> => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("portfolio", data.portfolio);
    formData.append("price", data.price.toString());
    formData.append("category", data.category);

    if (data.images) {
        data.images.forEach((file) => formData.append("images", file));
    }

    const response = await fetch(`${API_URL}/api/services/create`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
            `Error creating service: ${response.status} - ${errorData}`
        );
    }

    return await response.json();
};

export const fetchServices = async (
    portfolioId: string,
    token: string
): Promise<Service[]> => {
    const response = await fetch(
        `${API_URL}/api/services/portfolio/${portfolioId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
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

export const updateService = async (
    serviceId: string,
    data: ServiceForm,
    token: string
): Promise<Service> => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("portfolio", data.portfolio);
    formData.append("price", data.price.toString());
    formData.append("category", data.category);

    if (data.images) {
        data.images.forEach((file) => formData.append("images", file));
    }

    if (data.removeImageUrls && data.removeImageUrls.length > 0) {
        formData.append(
            "removeImageUrls",
            JSON.stringify(data.removeImageUrls)
        );
    }

    const response = await fetch(
        `${API_URL}/api/services/${serviceId}/update`,
        {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        }
    );

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
            `Error updating service: ${response.status} - ${errorData}`
        );
    }

    return await response.json();
};

export const deleteService = async (
    serviceId: string,
    token: string
): Promise<void> => {
    const response = await fetch(
        `${API_URL}/api/services/${serviceId}/delete`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
            `Error deleting service: ${response.status} - ${errorData}`
        );
    }
};

export const fetchAllService = async (token: string): Promise<Service[]> => {
    const response = await fetch(`${API_URL}/api/services/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
            `Error fetching services: ${response.status} - ${errorData}`
        );
    }

    return await response.json();
};
