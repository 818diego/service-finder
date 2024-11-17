import React, { useEffect, useState } from "react";
import OfferCard from "../components/MyOfferPage/OfferCard";
import { Offer } from "../types/offer";
import { getAllOffers } from "../services/offersFetch";
import { fetchAllPortfolios } from "../services/portfolioFetch";
import { Portfolio } from "../types/portfolio";
import PortfolioCard from "../components/MyPortfoliosPage/PortfolioCard";

const Home: React.FC = () => {
    const [userType, setUserType] = useState<"Cliente" | "Proveedor" | null>(
        null
    );
    const [username, setUsername] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);

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
                    setUsername(payload.username);
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

    useEffect(() => {
        const fetchPortfolios = async () => {
            const token = localStorage.getItem("token");
            if (token && userType === "Cliente") {
                try {
                    const portfolios = await fetchAllPortfolios(token);
                    setPortfolios(portfolios as Portfolio[]);
                } catch (error) {
                    console.error("Error fetching portfolios:", error);
                    setError("Error loading portfolios.");
                }
            }
        };

        fetchPortfolios();
    }, [userType]);

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
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                        Bienvenido, {username}
                    </p>
                    {error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {portfolios.map((portfolio) => {
                                return (
                                    <PortfolioCard
                                        key={portfolio._id}
                                        portfolio={portfolio}
                                        providerUsername={
                                            portfolio.provider?.username
                                        }
                                        isEditable={false}
                                    />
                                );
                            })}
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
