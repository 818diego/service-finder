import React, { useEffect, useState } from "react";
import PortfolioCardClient from "../components/ClientComponents/PortfolioCardClient";
import { createChat } from "../services/chatsFetch";
import { fetchAllService } from "../services/serviceFetch";
import { Service } from "../types/service";
import OfferCard from "../components/MyOfferPage/OfferCard";
import { Offer } from "../types/offer";
import { getAllOffers } from "../services/offersFetch";
import Modal from "../components/Modal";

const Home: React.FC = () => {
    const [userType, setUserType] = useState<"Cliente" | "Proveedor" | null>(
        null
    );
    const [services, setServices] = useState<Service[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                if (
                    payload.userType === "Proveedor" ||
                    payload.userType === "Cliente"
                ) {
                    setUserType(payload.userType);
                } else {
                    setUserType(null);
                }
            } catch (error) {
                console.error("Error al decodificar el token", error);
                setUserType(null);
            }
        } else {
            console.warn("No hay token");
            setUserType(null);
        }
    }, []);

    useEffect(() => {
        const fetchServices = async () => {
            const token = localStorage.getItem("token");
            if (token && userType === "Cliente") {
                try {
                    const services = await fetchAllService(token);
                    setServices(services as Service[]);
                } catch (error) {
                    console.error("Error fetching services:", error);
                    setError("Error loading services.");
                }
            }
        };

        fetchServices();
    }, [userType]);

    useEffect(() => {
        const fetchOffers = async () => {
            const token = localStorage.getItem("token");
            if (token && userType === "Proveedor") {
                try {
                    const offers = await getAllOffers(token);
                    setOffers(offers);
                } catch (error) {
                    console.error("Error fetching offers:", error);
                    setError("Error loading offers.");
                }
            }
        };

        fetchOffers();
    }, [userType]);

    const handleSendProposalClick = async (
        serviceId: string,
        initialMessage: string
    ) => {
        console.log("serviceId recibido:", serviceId); // Debug
        console.log("Mensaje inicial recibido:", initialMessage); // Debug

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            if (payload.userType !== "Cliente") {
                console.error("Unauthorized: User is not a Cliente");
                return;
            }

            const response = await createChat(serviceId, initialMessage, token);

            console.log("Chat creado:", response);
        } catch (error) {
            console.error(
                "Error al decodificar el token o crear el chat:",
                error
            );
        }
    };

    const handleSendOfferClick = (offer: Offer) => {
        setSelectedOffer(offer);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedOffer(null);
    };

    const handleModalSubmit = (message: string) => {
        if (selectedOffer) {
            handleSendProposalClick(selectedOffer._id, message);
        }
        handleModalClose();
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {userType === "Proveedor" && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                        Aquí son las ofertas de un cliente
                    </h2>
                    {error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {offers.map((offer) => (
                                <OfferCard
                                    key={offer._id}
                                    offer={offer}
                                    isEditable={false}
                                    sendOffer={() =>
                                        handleSendOfferClick(offer)
                                    } // Modify this line
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
            {userType === "Cliente" && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                        Encuentra el servicio que necesitas
                    </h2>
                    {error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {services.map((portfolio) => (
                                <PortfolioCardClient
                                    key={portfolio._id}
                                    service={portfolio}
                                    onSendProposalClick={(initialMessage) =>
                                        handleSendProposalClick(
                                            portfolio._id,
                                            initialMessage
                                        )
                                    }
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
            {userType === null && (
                <div className="flex flex-col items-center justify-center text-center">
                    <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                        Bienvenido a Services Finder
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Descubre los mejores servicios en tu área con solo unos
                        clics
                    </p>
                </div>
            )}
            {isModalOpen && (
                <Modal
                    title="Escribe tu oferta para el cliente"
                    onClose={handleModalClose}
                    onSubmit={handleModalSubmit}
                />
            )}
        </div>
    );
};

export default Home;
