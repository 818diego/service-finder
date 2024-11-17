import React, { useState } from "react";
import { Offer } from "../../types/offer";
import {
    FaClock,
    FaTag,
    FaEdit,
    FaTrash,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";

interface OfferCardProps {
    offer: Offer;
    onEdit?: () => void;
    onDelete?: () => void;
    sendOffer?: () => void;
    isEditable: boolean;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer, onEdit, onDelete, sendOffer, isEditable }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        setCurrentImageIndex(
            (prevIndex) => (prevIndex + 1) % (offer.images?.length || 1)
        );
    };

    const prevImage = () => {
        setCurrentImageIndex(
            (prevIndex) =>
                (prevIndex - 1 + (offer.images?.length || 1)) %
                (offer.images?.length || 1)
        );
    };

    return (
        <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800 transition duration-300 relative border border-gray-200 dark:border-gray-700 hover:shadow-xl flex flex-col justify-between">
            {/* Image section */}
            <div className="relative">
                {offer.images && offer.images.length > 0 ? (
                    <div className="relative">
                        <img
                            src={offer.images[currentImageIndex]}
                            alt={offer.title}
                            className="object-cover w-full h-48 rounded-t-lg"
                        />
                        {offer.images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-75 text-white p-2 rounded-full">
                                    <FaChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-75 text-white p-2 rounded-full">
                                    <FaChevronRight className="w-5 h-5" />
                                </button>
                            </>
                        )}
                        <div className="absolute bottom-2 right-2">
                            <span className="inline-flex items-center bg-blue-600 dark:bg-blue-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                {offer.category}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                        No image available
                    </div>
                )}
            </div>

            {/* Content section */}
            <div className="p-3 flex-grow flex flex-col justify-between min-h-[180px]">
                <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                        {offer.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 text-justify">
                        {offer.description}
                    </p>
                </div>

                {/* Status and Budget */}
                <div className="flex justify-around items-center mt-3 text-sm text-gray-900 dark:text-gray-100 space-x-4">
                    <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            offer.status === "Activo"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                        }`}>
                        <FaClock className="mr-1" />
                        {offer.status}
                    </span>
                    <div className="flex items-center text-lg font-semibold text-gray-900 dark:text-gray-100">
                        <FaTag className="w-4 h-4 mr-1 text-yellow-300" />
                        ${offer.budget}
                    </div>
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-evenly space-x-1 px-3 py-2 border-t border-gray-200 dark:border-gray-700">
                {isEditable ? (
                    <>
                        <button
                            onClick={onEdit}
                            className="flex items-center px-3 py-1 text-blue-500 hover:underline hover:text-blue-700 transition duration-200">
                            <FaEdit className="w-4 h-4 mr-1" />
                            Editar
                        </button>
                        <button
                            onClick={onDelete}
                            className="flex items-center px-3 py-1 text-red-500 hover:underline hover:text-red-700 transition duration-200">
                            <FaTrash className="w-4 h-4 mr-1" />
                            Eliminar
                        </button>
                    </>
                ) : (
                    <button
                        onClick={sendOffer}
                        className="flex items-center px-3 py-1 text-green-500 hover:underline hover:text-green-700 transition duration-200">
                        Enviar Oferta
                    </button>
                )}
            </div>
        </div>
    );
};

export default OfferCard;
