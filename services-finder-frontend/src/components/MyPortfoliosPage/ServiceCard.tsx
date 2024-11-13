import React, { useState } from "react";
import { Edit, Trash2, DollarSign, ChevronLeft, ChevronRight } from "lucide-react";
import { Service } from "../../types/service";

interface ServiceCardProps {
    service: Service;
    onEdit: () => void;
    onDelete: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
    service,
    onEdit,
    onDelete,
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === service.images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? service.images.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800 transition duration-300 relative border border-gray-200 dark:border-gray-700 hover:shadow-xl flex flex-col justify-between">
            {/* Image section */}
            <div className="relative">
                {service.images && service.images.length > 0 ? (
                    <div className="relative">
                        <img
                            src={
                                typeof service.images[currentImageIndex] === "string"
                                    ? service.images[currentImageIndex]
                                    : URL.createObjectURL(service.images[currentImageIndex])
                            }
                            alt={service.title}
                            className="object-cover w-full h-48 rounded-t-lg"
                        />
                        {service.images.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrevImage}
                                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-1 rounded-full">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleNextImage}
                                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-1 rounded-full">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                        No image available
                    </div>
                )}
            </div>

            {/* Content section */}
            <div className="p-4 flex-grow flex flex-col justify-between min-h-[200px]">
                <div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100">
                        {service.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 text-justify">
                        {service.description}
                    </p>
                </div>

                {/* Price */}
                <div className="flex items-center mt-4 text-sm text-gray-900 dark:text-gray-100">
                    <DollarSign className="w-5 h-5 mr-1 text-green-500" />
                    <span className="text-lg font-semibold">
                        ${service.price.toFixed(2)}
                    </span>
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-evenly space-x-2 px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={onEdit}
                    className="flex items-center px-4 py-2 text-blue-500 hover:underline hover:text-blue-700 transition duration-200">
                    <Edit className="w-5 h-5 mr-1" />
                    Editar
                </button>
                <button
                    onClick={onDelete}
                    className="flex items-center px-4 py-2 text-red-500 hover:underline hover:text-red-700 transition duration-200">
                    <Trash2 className="w-5 h-5 mr-1" />
                    Eliminar
                </button>
            </div>
        </div>
    );
};

export default ServiceCard;