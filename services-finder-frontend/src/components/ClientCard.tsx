import React from "react";
import { FaClock, FaTag, FaBriefcase } from "react-icons/fa";
import { OfferResponse } from "../types/offer";

interface WorkProposalCardProps {
    proposal: OfferResponse;
}

const WorkProposalCard: React.FC<WorkProposalCardProps> = ({ proposal }) => {
    const { title, description, budget, status, category, images } = proposal;

    return (
        <div className="max-w-md rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800 transition duration-300 p-6 space-y-5 transform hover:shadow-xl">
            <div className="text-start space-y-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    {description}
                </p>
            </div>
            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                <div>
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            status === "Activo"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                        }`}>
                        <FaClock className="mr-2" />
                        {status}
                    </span>
                </div>
                <div className="flex items-center text-lg font-semibold text-gray-900 dark:text-gray-100">
                    <FaTag className="mr-2 text-yellow-300 text-sm" />${budget}
                </div>
            </div>
            <div className="mt-4 text-center">
                <span className="inline-flex items-center bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
                    {category}
                </span>
            </div>
            {images && images.length > 0 && (
                <div className="mt-4">
                    <img
                        src={images[0]}
                        alt="Offer Image"
                        className="w-full h-40 object-cover rounded-md"
                    />
                </div>
            )}
            <div className="flex justify-center mt-4">
                <button className="flex items-center justify-center w-full max-w-[130px] space-x-2 bg-transparent text-green-600 dark:text-green-400 font-medium text-sm focus:outline-none hover:underline">
                    <FaBriefcase className="text-lg" />
                    <span>Apply Now</span>
                </button>
            </div>
        </div>
    );
};

export default WorkProposalCard;
