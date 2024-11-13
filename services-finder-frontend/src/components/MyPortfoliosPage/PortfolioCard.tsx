import React, { useState } from "react";
import { Edit, Trash2, Clock, Folder, User } from "lucide-react";
import { FaPlus } from "react-icons/fa";
import ModalService from "./Modals/ModalService";
import ModalServiceAll from "./Modals/ModalServicesAll";
import { createService } from "../../services/serviceFetch";
import { ServiceForm } from "../../types/service";
import { Portfolio } from "../../types/portfolio";
import { useAuth } from "../../Context/AuthContext";

interface PortfolioCardProps {
    portfolio: Portfolio;
    onEditClick: () => void;
    onDeleteClick: () => void;
    onServiceClick: (serviceId: string) => void;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({
    portfolio,
    onEditClick,
    onDeleteClick,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalServicesOpen, setIsModalServicesOpen] = useState(false);
    const { user } = useAuth();

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };
    const handleCloseModal = () => setIsModalOpen(false);

    const handleSubmit = async (formData: FormData | null) => {
        if (!formData) {
            console.error("Form data is null");
            return;
        }
        if (!user) {
            console.error("User is not authenticated");
            return;
        }

        const data: ServiceForm = {
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            portfolio: portfolio._id,
            price: Number(formData.get("price")),
            category: formData.get("category") as string,
            images: formData.getAll("images") as File[],
        };

        try {
            const service = await createService(
                data,
                localStorage.getItem("authToken") || ""
            );
            console.log("Service created:", service);
            handleCloseModal();
        } catch (error) {
            console.error("Failed to create service:", error);
        }
    };

    const handleOpenModalServicesAll = () => {
        setIsModalServicesOpen(true);
    };
    const handleCloseModalServicesAll = () => setIsModalServicesOpen(false);

    return (
        <div className="max-w-md rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800 transition duration-300 relative">
            <ModalService
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                mode="create"
                onSubmit={handleSubmit}
                portfolioName={portfolio.title}
                portfolioId={portfolio._id}
                className="modal-fade-in modal-scale-in"
            />

            <div className="relative group">
                <img
                    src={portfolio.image}
                    alt={`${portfolio.title} by ${portfolio.provider.username}`}
                    className="object-cover w-full h-48 rounded-t-lg cursor-pointer transition duration-300 group-hover:blur-sm"
                />
                <div
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition duration-300 rounded-t-lg cursor-pointer"
                    onClick={() => handleOpenModalServicesAll()} // Añadido onClick aquí
                >
                    <span className="text-white text-lg font-bold opacity-0 group-hover:opacity-100 transition duration-300">
                        Ver servicios
                    </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm flex items-center">
                        <User className="w-5 h-5 inline mr-1" />
                        {portfolio.provider.username}
                    </div>
                </div>
                <button
                    onClick={onEditClick}
                    className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition duration-200"
                    aria-label="Editar Portafolio">
                    <Edit size={16} />
                </button>
                <button
                    onClick={onDeleteClick}
                    className="absolute top-2 right-11 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition duration-200"
                    aria-label="Eliminar Portafolio">
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="px-6 py-4 min-h-[180px]">
                <h2 className="font-bold text-xl mb-2 text-gray-900 dark:text-gray-100 text-center">
                    {portfolio.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-justify">
                    {portfolio.description}
                </p>
            </div>

            <div className="px-6 py-4">
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5" />
                        <span>{portfolio.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Folder className="w-5 h-5" />
                        <span>{portfolio.category}</span>
                    </div>
                </div>
            </div>

            <div className="px-6 py-4 mb-2">
                <CustomButton
                    onClick={handleOpenModal}
                    label={
                        <>
                            <FaPlus className="mr-2" /> Agregar servicio
                        </>
                    }
                />
            </div>

            <ModalServiceAll
                isOpen={isModalServicesOpen}
                onClose={() => handleCloseModalServicesAll()}
                providerUsername={portfolio.provider.username}
                portfolioId={portfolio._id}
                className="modal-fade-in modal-scale-in"
            />
        </div>
    );
};

const CustomButton: React.FC<{
    onClick: () => void;
    label: React.ReactNode;
}> = ({ onClick, label }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center justify-center px-4 py-2 mt-2 text-sm font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
        {label}
    </button>
);

export default PortfolioCard;
