import React from "react";
import { FaPlus, FaTrash, FaClock, FaTag } from "react-icons/fa";

interface MyServicesCardProps {
    providerName: string;
    title: string;
    description: string;
    price: string | number;
    duration: string;
    category: string;
    onCreatePostClick: () => void;
    onDeleteServiceClick: () => void;
    onEditServiceClick: () => void;
}

const MyServicesCard: React.FC<MyServicesCardProps> = ({
    providerName,
    title,
    description,
    price,
    duration,
    category,
    onCreatePostClick,
    onDeleteServiceClick,
    onEditServiceClick,
}) => {
    return (
        <div className="max-w-md rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800 transition duration-300 p-6 space-y-5 transform hover:shadow-xl">
            <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {providerName}
                </h2>
            </div>
            <div className="text-start space-y-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    {description}
                </p>
            </div>
            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
                    <FaClock className="mr-2" />
                    <span className="font-medium">Duration:</span> {duration}
                </div>
                <div className="flex items-center text-lg font-semibold text-gray-900 dark:text-gray-100">
                    <FaTag className="mr-2 text-yellow-300 text-sm" />
                    ${price}
                </div>
            </div>
            <div className="mt-4 text-center">
                <span className="inline-flex items-center bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
                    {category}
                </span>
            </div>
            <div className="flex justify-center mt-4 space-x-4">
                <button
                    className="flex items-center justify-center w-full max-w-[130px] space-x-2 bg-transparent text-blue-600 dark:text-blue-400 font-medium text-sm focus:outline-none hover:underline"
                    onClick={onCreatePostClick}>
                    <FaPlus className="text-lg" />
                    <span>Create Post</span>
                </button>
                <button
                    className="flex items-center justify-center w-full max-w-[130px] space-x-2 bg-transparent text-red-600 dark:text-red-400 font-medium text-sm focus:outline-none hover:underline"
                    onClick={onDeleteServiceClick}>
                    <FaTrash className="text-lg" />
                    <span>Delete</span>
                </button>
                <button
                    className="flex items-center justify-center w-full max-w-[130px] space-x-2 bg-transparent text-green-600 dark:text-green-400 font-medium text-sm focus:outline-none hover:underline"
                    onClick={onEditServiceClick}>
                    <FaTrash className="text-lg" />
                    <span>Edit</span>
                </button>
            </div>
        </div>
    );
};

export default MyServicesCard;
