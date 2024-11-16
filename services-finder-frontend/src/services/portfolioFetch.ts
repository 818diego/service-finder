import { Portfolio, PortfolioForm } from "../types/portfolio";

const API_URL = import.meta.env.VITE_API_URL;

// Obtener portfolios por ID de usuario
export const fetchUserPortfolios = async (
    userId: string,
    token: string
): Promise<Portfolio[]> => {
    const response = await fetch(
        `${API_URL}/api/portfolios/provider/${userId}`,
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
            `Error fetching portfolios: ${response.status} - ${errorData}`
        );
    }

    return (await response.json()) as Portfolio[];
};

// Crear portfolio
export const createPortfolio = async (
    token: string,
    portfolioData: PortfolioForm
) => {
    try {
        const formData = new FormData();
        formData.append("title", portfolioData.title);
        formData.append("description", portfolioData.description);
        formData.append("duration", portfolioData.duration);
        formData.append("category", portfolioData.category);

        if (portfolioData.image) {
            formData.append("image", portfolioData.image);
        }

        const response = await fetch(`${API_URL}/api/portfolios/create`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Error creating portfolio");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating portfolio:", error);
        throw error;
    }
};

// Actualizar portfolio
export const updatePortfolio = async (
    token: string,
    portfolioId: string,
    portfolioData: PortfolioForm
) => {
    try {
        const formData = new FormData();
        formData.append("title", portfolioData.title);
        formData.append("description", portfolioData.description);
        formData.append("duration", portfolioData.duration);
        formData.append("category", portfolioData.category);

        if (portfolioData.image) {
            formData.append("image", portfolioData.image);
        }

        const response = await fetch(
            `${API_URL}/api/portfolios/${portfolioId}/update`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            }
        );

        if (!response.ok) {
            throw new Error("Error updating portfolio");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating portfolio:", error);
        throw error;
    }
};

// Eliminar portfolio
export const deletePortfolio = async (token: string, portfolioId: string) => {
    try {
        const response = await fetch(
            `${API_URL}/api/portfolios/${portfolioId}/delete`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error("Error deleting portfolio");
        }

        return true;
    } catch (error) {
        console.error("Error deleting portfolio:", error);
        throw error;
    }
};

// Obtener todos los portfolios
export const fetchAllPortfolios = async (token: string) => {
    try {
        const response = await fetch(`${API_URL}/api/portfolios/list`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error fetching portfolios");
        }

        const data = await response.json();
        return data as Portfolio[];
    } catch (error) {
        console.error("Error fetching portfolios:", error);
        throw error;
    }
};
