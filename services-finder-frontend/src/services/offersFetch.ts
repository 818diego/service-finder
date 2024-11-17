import { OfferForm, Offer } from "../types/offer";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Obtener ofertas por ID de cliente
 * @param token - Token de autenticación
 * @returns Una promesa que resuelve en un arreglo de ofertas
 */
export const getOffersByClientId = async (token: string): Promise<Offer[]> => {
    try {
        // Decodificar el token para obtener el clientId
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

        const data: Offer[] = await response.json();
        return data;
    } catch (error) {
        console.error("Error en getOffersByClientId:", error);
        throw error;
    }
};

/**
 * Crear una nueva oferta
 * @param token - Token de autenticación
 * @param offerData - Datos de la oferta a crear
 * @returns Una promesa que resuelve en la oferta creada
 */
export const createOffer = async (token: string, offerData: OfferForm): Promise<Offer> => {
    try {
        const formData = new FormData();
        formData.append("title", offerData.title);
        formData.append("description", offerData.description);
        formData.append("category", offerData.category);
        formData.append("budget", offerData.budget.toString());
        formData.append("status", offerData.status);

        // Cambiado a 'files'
        if (offerData.files) {
            offerData.files.forEach((file) => formData.append("images", file));
        }

        const response = await fetch(`${API_URL}/api/job-offers/create`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Error al crear la oferta");
        }

        const data: Offer = await response.json();
        return data;
    } catch (error) {
        console.error("Error en createOffer:", error);
        throw error;
    }
};

/**
 * Actualizar una oferta existente
 * @param token - Token de autenticación
 * @param offerId - ID de la oferta a actualizar
 * @param offerData - Datos de la oferta actualizada
 * @returns Una promesa que resuelve en la oferta actualizada
 */
export const updateOffer = async (
    token: string,
    offerId: string,
    offerData: OfferForm
): Promise<Offer> => {
    try {
        const formData = new FormData();
        formData.append("title", offerData.title);
        formData.append("description", offerData.description);
        formData.append("category", offerData.category);
        formData.append("budget", offerData.budget.toString());
        formData.append("status", offerData.status);

        if (offerData.files) {
            offerData.files.forEach((file) => formData.append("images", file));
        }

        if (offerData.removeImageUrls && offerData.removeImageUrls.length > 0) {
            formData.append(
                "removeImageUrls",
                JSON.stringify(offerData.removeImageUrls)
            );
        }

        const response = await fetch(
            `${API_URL}/api/job-offers/${offerId}/update`,
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
            throw new Error(`Error al actualizar la oferta: ${response.status} - ${errorData}`);
        }

        const data: Offer = await response.json();
        return data;
    } catch (error) {
        console.error("Error en updateOffer:", error);
        throw error;
    }
};

/**
 * Eliminar una oferta
 * @param token - Token de autenticación
 * @param offerId - ID de la oferta a eliminar
 * @returns Una promesa que resuelve en void
 */
export const deleteOffer = async (
    token: string,
    offerId: string
): Promise<void> => {
    try {
        const response = await fetch(
            `${API_URL}/api/job-offers/${offerId}/delete`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error("Error al eliminar la oferta");
        }

        // Asumiendo que la API no devuelve contenido en la respuesta DELETE
        return;
    } catch (error) {
        console.error("Error en deleteOffer:", error);
        throw error;
    }
};

/**
 * Obtener todas las ofertas
 * @param token - Token de autenticación
 * @returns Una promesa que resuelve en un arreglo de ofertas
 */
export const getAllOffers = async (token: string): Promise<Offer[]> => {
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

        const data: Offer[] = await response.json();
        return data;
    } catch (error) {
        console.error("Error en getAllOffers:", error);
        throw error;
    }
};
