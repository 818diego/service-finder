import React, { useState, useEffect } from "react";
import ModalOffers from "../../../components/MyOfferPage/ModalOffers";
import OfferCard from "../../../components/MyOfferPage/OfferCard";
import { OfferData, OfferResponse } from "../../../types/offer";
import {
    createOffer,
    getOffersByClientId,
    updateOffer,
    deleteOffer,
} from "../../../services/offersFetch";
import { toast } from "react-toastify";

const OffersPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit" | "delete">(
        "create"
    );
    const [selectedOffer, setSelectedOffer] = useState<OfferResponse | null>(
        null
    );
    const [offers, setOffers] = useState<OfferResponse[]>([]);
    const token = localStorage.getItem("token") || "";

    const fetchOffers = async () => {
        try {
            const offers = await getOffersByClientId(token);
            setOffers(offers);
            console.log("Ofertas obtenidas:", offers);
        } catch (error) {
            console.error("Error al obtener ofertas:", error);
        }
    };

    useEffect(() => {
        fetchOffers();
    }, [token]);

    const openCreateModal = () => {
        setModalMode("create");
        setSelectedOffer(null);
        setIsModalOpen(true);
    };

    const openEditModal = (offer: OfferResponse) => {
        setModalMode("edit");
        setSelectedOffer(offer);
        setIsModalOpen(true);
    };

    const openDeleteModal = (offer: OfferResponse) => {
        setModalMode("delete");
        setSelectedOffer(offer);
        setIsModalOpen(true);
    };

    const handleConfirm = async (
        offerData: OfferData,
        resetForm: () => void
    ) => {
        if (modalMode === "create") {
            try {
                const response = await createOffer(token, offerData);
                console.log("Offer created:", response);
                toast.success("Oferta creada exitosamente");
                resetForm();
            } catch (error) {
                console.error("Error al crear la oferta:", error);
            }
        } else if (modalMode === "edit" && selectedOffer) {
            try {
                const offerId = selectedOffer._id;
                const response = await updateOffer(token, offerId, offerData);
                console.log("Offer updated:", response);
                toast.success("Oferta actualizada exitosamente");
            } catch (error) {
                console.error("Error updating offer:", error);
                toast.error("Error al actualizar la oferta");
            }
        }
        setIsModalOpen(false);
        fetchOffers();
    };

    const handleDelete = async () => {
        if (selectedOffer) {
            try {
                await deleteOffer(token, selectedOffer._id);
                console.log("Offer deleted:", selectedOffer);
                toast.success("Oferta eliminada exitosamente");
            } catch (error) {
                console.error("Error al eliminar la oferta:", error);
                toast.error("Error al eliminar la oferta");
            }
        }
        setIsModalOpen(false);
        fetchOffers();
    };

    function resetForm(): void {
        throw new Error("Function not implemented.");
    }

    return (
        <div className="space-y-5">
            <div className="sm:rounded-lg transition-colors duration-300 ease-in-out">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            Offers
                        </h1>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-300">
                            This is the Offers page for the services finder app.
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 ">
                        Create Offer
                    </button>
                </div>
            </div>

            {/* Renderizar las tarjetas de ofertas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {offers.map((offer) => (
                    <OfferCard
                        key={offer._id}
                        offer={offer}
                        onEdit={() => openEditModal(offer)}
                        onDelete={() => openDeleteModal(offer)}
                    />
                ))}
            </div>

            {/* Modal de Oferta */}
            <ModalOffers
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={(offerData) => handleConfirm(offerData, resetForm)}
                onDelete={handleDelete}
                mode={modalMode}
                initialData={
                    selectedOffer
                        ? {
                              ...selectedOffer,
                              status: selectedOffer.status === "active",
                          }
                        : undefined
                }
                resetForm={resetForm}
            />
        </div>
    );
};

export default OffersPage;
