import React, { useState } from "react";
import { OfferResponse } from "../../types/offer";
import {
    FaClock,
    FaTag,
    FaEdit,
    FaTrash,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";

interface OfferCardProps {
    offer: OfferResponse;
    onEdit: () => void;
    onDelete: () => void;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer, onEdit, onDelete }) => {
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
        <div className="max-w-md rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800 transition duration-300 p-6 space-y-5 transform hover:shadow-xl">
            <div className="text-start space-y-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {offer.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    {offer.description}
                </p>
            </div>
            <div className="flex justify-between items-center dark:bg-gray-800 p-2 rounded">
                <div>
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            offer.status === "Activo"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                        }`}>
                        <FaClock className="mr-2" />
                        {offer.status}
                    </span>
                </div>
                <div className="flex items-center text-lg font-semibold text-gray-900 dark:text-gray-100">
                    <FaTag className="mr-2 text-yellow-300 text-sm" />$
                    {offer.budget}
                </div>
            </div>
            <div className="mt-4 text-center">
                <span className="inline-flex items-center bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
                    {offer.category}
                </span>
            </div>
            <div className="relative group">
                {offer.images && offer.images.length > 0 ? (
                    <>
                        <img
                            src={offer.images[currentImageIndex]}
                            alt={offer.title}
                            className="w-full h-48 object-contain rounded-lg transition-opacity duration-300 ease-in-out"
                        />
                        {offer.images.length > 1 && (
                            <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <button
                                    onClick={prevImage}
                                    className="bg-gray-700 bg-opacity-60 hover:bg-opacity-80 p-2 rounded-full text-white">
                                    <FaChevronLeft />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="bg-gray-700 bg-opacity-60 hover:bg-opacity-80 p-2 rounded-full text-white">
                                    <FaChevronRight />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="w-full h-32 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg">
                        <span className="text-gray-400 dark:text-gray-500">
                            No Image Available
                        </span>
                    </div>
                )}
            </div>
            <div className="flex justify-center mt-4 space-x-4">
                <button
                    className="flex items-center justify-center w-full max-w-[130px] space-x-2 bg-transparent text-green-600 dark:text-green-400 font-medium text-sm focus:outline-none hover:underline"
                    onClick={onEdit}>
                    <FaEdit className="text-lg" />
                    <span>Edit</span>
                </button>
                <button
                    className="flex items-center justify-center w-full max-w-[130px] space-x-2 bg-transparent text-red-600 dark:text-red-400 font-medium text-sm focus:outline-none hover:underline"
                    onClick={onDelete}>
                    <FaTrash className="text-lg" />
                    <span>Delete</span>
                </button>
            </div>
        </div>
    );
};

export default OfferCard;
