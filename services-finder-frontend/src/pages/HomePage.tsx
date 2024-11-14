import React, { useEffect, useState } from "react";
import { Portfolio } from "../types/portfolio";
import PortfolioCardClient from "../components/ClientComponents/PortfolioCardClient";

const Home: React.FC = () => {
    const [userType, setUserType] = useState<"Cliente" | "Proveedor" | null>(
        null
    );
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
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
        const fetchPortfolios = async () => {
            const token = localStorage.getItem("token");
            if (token && userType === "Cliente") {
                try {
                    const response = await fetch(
                        "http://localhost:3000/api/portfolios/list",
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
                    setPortfolios(data as Portfolio[]);
                } catch (error) {
                    console.error("Error fetching portfolios:", error);
                    setError("Error loading portfolios.");
                }
            }
        };

        fetchPortfolios();
    }, [userType]);

    const handleSendProposal = (portfolioId: string) => {
        console.log("Sending proposal for portfolio:", portfolioId);
        // Implement your proposal sending logic here
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
                            {portfolios.map((portfolio) => (
                                <PortfolioCardClient
                                    key={portfolio._id}
                                    portfolio={portfolio}
                                    onSendProposalClick={() =>
                                        handleSendProposal(portfolio._id)
                                    }
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
            {userType === null && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                        Bienvenido a Services Finder
                    </h1>
                    <p className="text-md text-gray-600 dark:text-gray-400">
                        Descubre los mejores servicios en tu área
                    </p>
                </div>
            )}
        </div>
    );
};

export default Home;
