import React from "react";
import { FaClock, FaTag, FaBriefcase } from "react-icons/fa";
import { WorkProposal } from "../data/workProposals";

interface WorkProposalCardProps {
    proposal: WorkProposal;
}

const WorkProposalCard: React.FC<WorkProposalCardProps> = ({ proposal }) => {
    const {
        clientName,
        jobTitle,
        jobDescription,
        budget,
        duration,
        category,
        imageUrl,
    } = proposal;

    return (
        <div className="max-w-md rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800 transition duration-300 p-6 space-y-5 transform hover:shadow-xl">
            <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {clientName}
                </h2>
            </div>
            <div className="text-start space-y-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {jobTitle}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    {jobDescription}
                </p>
            </div>
            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
                    <FaClock className="mr-2" />
                    <span className="font-medium">Duration:</span> {duration}
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
            <div className="mt-4">
                <img
                    src={imageUrl}
                    alt="Work Proposal"
                    className="w-full h-40 object-cover rounded-md"
                />
            </div>
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
