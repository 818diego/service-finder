import { Portfolio, PortfolioForm } from "../types/portfolio";

export const fetchUserPortfolios = async (
    userId: string,
    token: string
): Promise<Portfolio[]> => {
    const response = await fetch(
        `http://node2.frokie.it:3000/api/portfolios/provider/${userId}`,
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

export const createPortfolio = async (
    token: string,
    portfolioData: PortfolioForm
) => {
    try {
        // Crear el FormData
        const formData = new FormData();
        formData.append("title", portfolioData.title);
        formData.append("description", portfolioData.description);
        formData.append("duration", portfolioData.duration);
        formData.append("category", portfolioData.category);

        // Adjuntar la imagen solo si está presente
        if (portfolioData.image) {
            formData.append("image", portfolioData.image);
        }

        const response = await fetch(
            "http://node2.frokie.it:3000/api/portfolios/create",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`, // Solo se envía la autorización
                },
                body: formData, // Enviar el FormData directamente
            }
        );

        if (!response.ok) {
            throw new Error("Error creating portfolio");
        }

        // El backend devuelve un JSON con todos los datos, incluyendo la URL de la imagen
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating portfolio:", error);
        throw error;
    }
};

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

        // Solo agregar la imagen si el usuario proporcionó una nueva imagen
        if (portfolioData.image) {
            formData.append("image", portfolioData.image);
        }

        const response = await fetch(
            `http://node2.frokie.it:3000/api/portfolios/${portfolioId}/update`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData, // Enviar como FormData
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

export const deletePortfolio = async (token: string, portfolioId: string) => {
    try {
        const response = await fetch(
            `http://node2.frokie.it:3000/api/portfolios/${portfolioId}/delete`,
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

export const fetchAllPortfolios = async (token: string) => {
    try {
        const response = await fetch(
            "http://node2.frokie.it:3000/api/portfolios/list",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

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
