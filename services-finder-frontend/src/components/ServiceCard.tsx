import React from "react";
import { Star } from "lucide-react";

interface ServiceCardProps {
    image: string;
    provider: string;
    rating: number;
    specialty: string;
    service: string;
    description: string;
    tools: string[]; // Herramientas o servicios
    exampleImages: string[]; // Imágenes de ejemplo de trabajo
    price: string;
    onDetailsClick: () => void;
    onHireClick: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
    image,
    provider,
    rating,
    specialty,
    service,
    description,
    tools,
    exampleImages,
    price,
    onDetailsClick,
    onHireClick,
}) => {
    return (
        <div className="max-w-md rounded overflow-hidden shadow-lg bg-white dark:bg-gray-800 transition duration-300">
            <div className="flex justify-center">
                <img
                    className="w-24 h-24 rounded-full object-cover cursor-pointer mt-4"
                    src={image}
                    alt={provider}
                    onClick={onDetailsClick}
                />
            </div>
            <div className="px-6 py-4">
                <div className="font-bold text-2xl mb-2 text-gray-900 dark:text-gray-100 text-center">
                    {provider}
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-lg text-center">
                    {specialty} - {service}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-justify">
                    {description}
                </p>
            </div>
            
            <div className="px-6 pt-4 pb-2">
                <div className="flex flex-wrap justify-flex-start">
                    {tools.map((tool, index) => (
                        <span
                            key={index}
                            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-semibold mr-2 mb-2 px-3 py-1 rounded-full">
                            {tool}
                        </span>
                    ))}
                </div>
            </div>

            <div className="px-6 py-4">
                <div className="flex space-x-4 justify-center">
                    {exampleImages.map((example, index) => (
                        <img
                            key={index}
                            className="w-24 h-24 object-cover rounded-md"
                            src={example}
                            alt={`example-${index}`}
                        />
                    ))}
                </div>
            </div>

            <div className="px-6 py-4">
                <div className="flex items-center justify-center">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`h-5 w-5 ${
                                i < Math.round(rating)
                                    ? "text-yellow-500"
                                    : "text-gray-300"
                            }`}
                        />
                    ))}
                    <span className="ml-2 text-gray-600 dark:text-gray-300">
                        {rating} estrellas
                    </span>
                    <span className="ml-auto text-xl font-bold text-gray-900 dark:text-gray-100">
                        {price}
                    </span>
                </div>
            </div>

            <div className="px-6 py-4 flex justify-between">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                    onClick={onDetailsClick}>
                    Ver detalles
                </button>
                <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                    onClick={onHireClick}>
                    Contratar servicio
                </button>
            </div>
        </div>
    );
};

export default ServiceCard;
