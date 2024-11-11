import React, { useState } from "react";
import { Edit, Trash2, Clock, Folder, User } from "lucide-react";
import { FaPlus } from "react-icons/fa";
import ModalServicesAll from "./ModalServicesAll";

interface PortfolioCardProps {
    title: string;
    description: string;
    duration: string;
    category: string;
    provider: {
        id: string;
        username: string;
    };
    image: string;
    onServiceClick: () => void;
    onEditClick: () => void;
    onDeleteClick: () => void;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({
    title,
    description,
    duration,
    category,
    provider,
    image,
    onServiceClick,
    onEditClick,
    onDeleteClick,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleImageClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="max-w-md rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800 transition duration-300 relative">
            {/* Modal */}
            {isModalOpen && (
                <ModalServicesAll
                    onClose={handleCloseModal}
                    providerUsername={provider.username}
                />
            )}

            {/* Image section */}
            <div className="relative">
                <img
                    src={image}
                    alt={`${title} by ${provider.username}`}
                    className="object-cover w-full h-48 rounded-t-lg cursor-pointer"
                    onClick={handleImageClick}
                />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm flex items-center">
                        <User className="w-5 h-5 inline mr-1" />
                        {provider.username}
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

            {/* Title and description */}
            <div className="px-6 py-4 min-h-[180px]">
                <h2 className="font-bold text-xl mb-2 text-gray-900 dark:text-gray-100 text-center">
                    {title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-justify">
                    {description}
                </p>
            </div>

            {/* Additional details */}
            <div className="px-6 py-4">
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5" />
                        <span>{duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Folder className="w-5 h-5" />
                        <span>{category}</span>
                    </div>
                </div>
            </div>

            {/* Action button */}
            <div className="px-6 py-4 mb-2">
                <CustomButton
                    onClick={onServiceClick}
                    label={
                        <>
                            <FaPlus className="mr-2" /> Agregar servicio
                        </>
                    }
                />
            </div>
        </div>
    );
};

// Custom button component
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
