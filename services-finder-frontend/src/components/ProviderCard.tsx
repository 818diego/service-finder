import React from "react";
import { FaInfoCircle, FaShoppingCart } from "react-icons/fa";

interface ProviderCardProps {
    providerName: string;
    title: string;
    description: string;
    price: string | number;
    duration: string;
    category: string;
    onDetailsClick: () => void;
    onHireClick: () => void;
}

const ProviderCard: React.FC<ProviderCardProps> = ({
    providerName,
    title,
    description,
    price,
    duration,
    category,
    onDetailsClick,
    onHireClick,
}) => {
    return (
        <div className="max-w-md rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800 transition duration-300 p-6 flex flex-col justify-between space-y-4">
            <div className="text-center">
                <h2 className="font-semibold text-xl mb-1 text-gray-900 dark:text-gray-100">
                    {providerName}
                </h2>
                <span className="inline-block bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 px-3 py-1 rounded-full text-xs font-medium mb-4">
                    {category}
                </span>
                <div className="text-start">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mt-2">
                        {title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 text-justify leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>

            <div className="flex justify-between items-center text-gray-600 dark:text-gray-400 mt-4">
                <p className=" px-3 py-1 rounded-full text-sm">
                    Duración: {duration}
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    ${price}
                </p>
            </div>

            <div className="flex justify-center space-x-2 mt-6">
                <button
                    className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 text-sm"
                    onClick={onDetailsClick}>
                    <FaInfoCircle className="mr-1" />
                    Ver detalles
                </button>
                <button
                    className="flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 text-sm"
                    onClick={onHireClick}>
                    <FaShoppingCart className="mr-1" />
                    Contratar servicio
                </button>
            </div>
        </div>
    );
};

export default ProviderCard;
