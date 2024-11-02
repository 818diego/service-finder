import React, { useEffect, useState } from "react";
import ProviderCard from "../components/ServicesPage/ServicesPageCard";
import { fetchServices } from "../services/serviceFetch";
import { Service } from "../types/service";

const ServicesPage: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getServices = async () => {
            try {
                const data = await fetchServices();
                setServices(data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("An unknown error occurred");
                }
            } finally {
                setLoading(false);
            }
        };

        getServices();
    }, []);

    if (loading) return <p>Cargando servicios...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="overflow-hidden transition-colors duration-300 ease-in-out">
            <div className="px-4 py-5 sm:px-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Welcome to Services
                </h1>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-300">
                    This is services the community offers.
                </p>
            </div>
            <div className="px-4 py-5 sm:px-6">
                {services.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {services.map((service) => (
                            <ProviderCard
                                key={service._id}
                                providerName={service.provider.username}
                                title={service.title}
                                description={service.description}
                                price={service.price}
                                duration={service.duration}
                                category={service.category}
                                onCreatePostClick={() =>
                                    console.log(
                                        "Ver detalles de",
                                        service.title
                                    )
                                }
                                onHireClick={() =>
                                    console.log(
                                        "Contratar servicio",
                                        service.title
                                    )
                                }
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                        No hay servicios disponibles.
                    </p>
                )}
            </div>
        </div>
    );
};

export default ServicesPage;