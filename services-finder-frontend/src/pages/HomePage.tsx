import React, { useEffect, useState } from "react";
import ServiceCard from "../components/ServiceCard";
// import ProviderCard from "../components/ProviderCard"; // Nuevo componente para Proveedores
import { popularServices, randomServices, Service } from "../data/services";

const Home: React.FC = () => {
    const [userType, setUserType] = useState<"Cliente" | "Proveedor" | null>(
        null
    );

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                setUserType(
                    payload.userType === "Proveedor" ? "Proveedor" : "Cliente"
                );
            } catch (error) {
                console.error("Error al decodificar el token", error);
                setUserType(null);
            }
        } else {
            console.warn("No hay token");
        }
    }, []);

    const handleCardClick = (providerId: number) => {
        console.log(
            `Redirigiendo a la página del proveedor con ID: ${providerId}`
        );
    };

    const handleHireClick = (providerId: number) => {
        console.log(`Contratando servicio del proveedor con ID: ${providerId}`);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {userType === "Proveedor" && (
                <>
                    <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                        Servicios Disponibles para Proveedores
                    </h2>
                    {/* <ProviderCard /> */}
                    {/* Aquí puedes agregar contenido específico para proveedores */}
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
                                onDetailsClick={() =>
                                    handleCardClick(service.id)
                                }
                                onHireClick={() => handleHireClick(service.id)}
                            />
                        ))}
                    </div>

                    {/* Sección de servicios aleatorios para Clientes */}
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
                                onDetailsClick={() =>
                                    handleCardClick(service.id)
                                }
                                onHireClick={() => handleHireClick(service.id)}
                            />
                        ))}
                    </div>
                </>
            )}
            {userType === null && <p>Cargando...</p>}
        </div>
    );
};

export default Home;
