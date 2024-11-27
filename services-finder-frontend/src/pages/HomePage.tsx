import React, { useEffect, useState } from "react";
import OfferCard from "../components/MyOfferPage/OfferCard";
import { Offer } from "../types/offer";
import { getAllOffers } from "../services/offersFetch";
import { fetchAllPortfolios } from "../services/portfolioFetch";
import { Portfolio } from "../types/portfolio";
import PortfolioCard from "../components/MyPortfoliosPage/PortfolioCard";
import { createChat } from "../services/chatsFetch";
import ModalProposeProvider from "../components/ModalProposeProvider";
import WelcomeContent from "../components/WelcomeContent"; // Import the new component

const Home: React.FC = () => {
    const [userType, setUserType] = useState<"Cliente" | "Proveedor" | null>(
        null
    );
    const [username, setUsername] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
    const [initialMessage, setInitialMessage] = useState("");

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

    const handleSendOffer = (offer: Offer) => {
        setSelectedOffer(offer);
        setShowModal(true);
    };

    const handleCreateChat = async () => {
        if (selectedOffer) {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    await createChat(
                        selectedOffer._id,
                        selectedOffer._id,
                        initialMessage,
                        token
                    ); // Ensure this uses _id and jobOfferId
                    setShowModal(false);
                    setInitialMessage("");
                } catch (error) {
                    console.error("Error creating chat:", error);
                    setError("Error creating chat.");
                }
            }
        }
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
                                    sendOffer={() => handleSendOffer(offer)}
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
            {userType === null && <WelcomeContent />}
            <ModalProposeProvider
                showModal={showModal}
                setShowModal={setShowModal}
                initialMessage={initialMessage}
                setInitialMessage={setInitialMessage}
                handleCreateChat={handleCreateChat}
            />
        </div>
    );
};

export default Home;
