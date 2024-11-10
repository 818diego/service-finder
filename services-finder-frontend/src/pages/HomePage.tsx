import React, { useEffect, useState } from "react";
import ServiceCard from "../components/ServiceCard";
import WorkProposalCard from "../components/ClientCard";
import { popularServices, randomServices, Service } from "../data/services";
import { getAllOffers } from "../services/offersFetch";

const Home: React.FC = () => {
    const [userType, setUserType] = useState<"Cliente" | "Proveedor" | null>(null);
    const [offers, setOffers] = useState([]); // Estado para las ofertas

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                if (payload.userType === "Proveedor" || payload.userType === "Cliente") {
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
        const fetchOffersData = async () => {
            const token = localStorage.getItem("token");
            if (token && userType === "Proveedor") {
                try {
                    const offersData = await getAllOffers(token);
                    setOffers(offersData); // Guardar ofertas en el estado
                    console.log("Ofertas obtenidas:", offersData);
                } catch (error) {
                    console.error("Error al obtener las ofertas:", error);
                }
            }
        };
        fetchOffersData();
    }, [userType]);

    const handleCardClick = (providerId: number) => {
        console.log(`Redirigiendo a la página del proveedor con ID: ${providerId}`);
    };

    const handleHireClick = (providerId: number) => {
        console.log(`Contratando servicio del proveedor con ID: ${providerId}`);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {userType === "Proveedor" && (
                <>
                    <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                        Estamos buscando tu talento
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {offers.map((offer, index) => (
                            <WorkProposalCard key={index} proposal={offer} />
                        ))}
                    </div>
                </>
            )}
            {userType === "Cliente" && (
                <>
                    <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                        Servicios de la comunidad
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {popularServices.map((service: Service) => (
                            <ServiceCard
                                key={service.id}
                                image={service.image}
                                provider={service.provider}
                                rating={service.rating}
                                specialty={service.specialty}
                                service={service.service}
                                description={service.description}
                                tools={service.tools}
                                exampleImages={service.exampleImages}
                                price={service.price}
                                onDetailsClick={() => handleCardClick(service.id)}
                                onHireClick={() => handleHireClick(service.id)}
                            />
                        ))}
                    </div>

                    <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-gray-100">
                        Servicios aleatorios
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {randomServices.map((service: Service) => (
                            <ServiceCard
                                key={service.id}
                                image={service.image}
                                provider={service.provider}
                                rating={service.rating}
                                specialty={service.specialty}
                                service={service.service}
                                description={service.description}
                                tools={service.tools}
                                exampleImages={service.exampleImages}
                                price={service.price}
                                onDetailsClick={() => handleCardClick(service.id)}
                                onHireClick={() => handleHireClick(service.id)}
                            />
                        ))}
                    </div>
                </>
            )}
            {userType === null && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Welcome to Services Finder
                    </h1>
                    <p className="text-lg text-gray-700 dark:text-gray-300">
                        See the best services in your area
                    </p>
                </div>
            )}
        </div>
    );
};

export default Home;
