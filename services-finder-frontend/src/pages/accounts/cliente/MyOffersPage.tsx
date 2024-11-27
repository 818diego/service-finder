import React, { useState, useEffect } from "react";
import ModalOffer from "../../../components/MyOfferPage/ModalOffers";
import OfferCard from "../../../components/MyOfferPage/OfferCard";
import { Offer, OfferForm } from "../../../types/offer";
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
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
    const [offers, setOffers] = useState<Offer[]>([]);
    const token = localStorage.getItem("token") || "";

    /**
     * Obtener las ofertas del cliente al cargar la página
     */
    const fetchOffers = async () => {
        try {
            const fetchedOffers = await getOffersByClientId(token);
            setOffers(fetchedOffers);
            console.log("Ofertas obtenidas:", fetchedOffers);
        } catch (error) {
            console.error("Error al obtener ofertas:", error);
            toast.error("Error al obtener las ofertas");
        }
    };

    useEffect(() => {
        if (token) {
            fetchOffers();
        }
    }, [token]);

    /**
     * Abrir el modal en modo creación
     */
    const openCreateModal = () => {
        setModalMode("create");
        setSelectedOffer(null);
        setIsModalOpen(true);
    };

    /**
     * Abrir el modal en modo edición con la oferta seleccionada
     * @param offer - Oferta a editar
     */
    const openEditModal = (offer: Offer) => {
        setModalMode("edit");
        setSelectedOffer(offer);
        setIsModalOpen(true);
    };

    /**
     * Abrir el modal en modo eliminación con la oferta seleccionada
     * @param offer - Oferta a eliminar
     */
    const openDeleteModal = (offer: Offer) => {
        setModalMode("delete");
        setSelectedOffer(offer);
        setIsModalOpen(true);
    };

    /**
     * Manejar la confirmación de creación o edición de una oferta
     * @param offerData - Datos de la oferta
     */
    const handleConfirm = async (offerData: OfferForm) => {
        if (modalMode === "create" && (!offerData.files || offerData.files.length === 0)) {
            toast.error("Debe subir al menos una imagen.");
            return;
        }
        if (modalMode === "create") {
            try {
                const newOffer = await createOffer(token, offerData);
                console.log("Oferta creada:", newOffer);
                toast.success("Oferta creada exitosamente");
                setOffers((prevOffers) => [...prevOffers, newOffer]);
            } catch (error) {
                console.error("Error al crear la oferta:", error);
                toast.error("Error al crear la oferta");
            }
        } else if (modalMode === "edit" && selectedOffer) {
            try {
                const updatedOffer = await updateOffer(
                    token,
                    selectedOffer._id,
                    offerData
                );
                console.log("Oferta actualizada:", updatedOffer);
                toast.success("Oferta actualizada exitosamente");
                setOffers((prevOffers) =>
                    prevOffers.map((offer) =>
                        offer._id === selectedOffer._id ? updatedOffer : offer
                    )
                );
            } catch (error) {
                console.error("Error al actualizar la oferta:", error);
                toast.error("Error al actualizar la oferta");
            }
        }
        setIsModalOpen(false);
    };

    /**
     * Manejar la eliminación de una oferta
     */
    const handleDelete = async () => {
        if (selectedOffer) {
            try {
                await deleteOffer(token, selectedOffer._id);
                console.log("Oferta eliminada:", selectedOffer);
                toast.success("Oferta eliminada exitosamente");
                setOffers((prevOffers) =>
                    prevOffers.filter(
                        (offer) => offer._id !== selectedOffer._id
                    )
                );
            } catch (error) {
                console.error("Error al eliminar la oferta:", error);
                toast.error("Error al eliminar la oferta");
            }
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-5">
            <div className="sm:rounded-lg transition-colors duration-300 ease-in-out">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            Ofertas
                        </h1>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-300">
                            Esta es la página de Ofertas para la aplicación de
                            búsqueda de servicios.
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 dark:hover:bg-blue-700 transition duration-200 ease-in-out">
                        Crear Oferta
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
                        isEditable={true}
                    />
                ))}
            </div>

            {/* Modal de Oferta */}
            <ModalOffer
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirm}
                onDelete={handleDelete}
                mode={modalMode}
                initialData={selectedOffer || undefined}
            />
        </div>
    );
};

export default OffersPage;
