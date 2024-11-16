import { OfferData } from "../types/offer";

const API_URL = import.meta.env.VITE_API_URL;

// Obtener ofertas por ID de cliente
export const getOffersByClientId = async (token: string) => {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const clientId = payload.userId;
        console.log("clientId:", clientId);

        const response = await fetch(
            `${API_URL}/api/job-offers/client/${clientId}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error("Error al obtener las ofertas");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en getOffersByClientId:", error);
        throw error;
    }
};

// Crear oferta
export const createOffer = async (token: string, offerData: OfferData) => {
    try {
        const response = await fetch(`${API_URL}/api/job-offers/create`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(offerData),
        });

        if (!response.ok) {
            throw new Error("Error al crear la oferta");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en createOffer:", error);
        throw error;
    }
};

// Actualizar oferta
export const updateOffer = async (
    token: string,
    offerId: string,
    offerData: OfferData
) => {
    try {
        const response = await fetch(
            `${API_URL}/api/job-offers/${offerId}/update`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(offerData),
            }
        );

        if (!response.ok) {
            throw new Error("Error al actualizar la oferta");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en updateOffer:", error);
        throw error;
    }
};

// Eliminar oferta
export const deleteOffer = async (token: string, offerId: string) => {
    try {
        const response = await fetch(
            `${API_URL}/api/job-offers/${offerId}/delete`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error("Error al eliminar la oferta");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en deleteOffer:", error);
        throw error;
    }
};

// Obtener todas las ofertas
export const getAllOffers = async (token: string) => {
    try {
        const response = await fetch(`${API_URL}/api/job-offers/all`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Error al obtener las ofertas");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en getAllOffers:", error);
        throw error;
    }
};
