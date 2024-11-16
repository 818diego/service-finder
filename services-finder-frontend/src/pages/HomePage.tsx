import React, { useEffect, useState } from "react";
import PortfolioCardClient from "../components/ClientComponents/PortfolioCardClient";
import { createChat } from "../services/chatsFetch";
import { fetchAllService } from "../services/serviceFetch";
import { Service } from "../types/service";

const Home: React.FC = () => {
    const [userType, setUserType] = useState<"Cliente" | "Proveedor" | null>(
        null
    );
    const [services, setServices] = useState<Service[]>([]);
    const [error, setError] = useState<string | null>(null);

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

    return (
        <div className="container mx-auto px-4 py-8">
            {userType === "Proveedor" && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                        Aquí son las ofertas de un cliente
                    </h2>
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
        </div>
    );
};

export default Home;
