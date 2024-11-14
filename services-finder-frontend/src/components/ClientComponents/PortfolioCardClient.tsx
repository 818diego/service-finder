import React, { useState } from "react";
import { Clock, Folder } from "lucide-react";
import { Portfolio } from "../../types/portfolio";
import ProposalModal from "./ProposalModal";

interface PortfolioCardClientProps {
    portfolio: Portfolio;
    onSendProposalClick: (
        portfolioId: string,
        initialMessage: string
    ) => void;
}

const PortfolioCardClient: React.FC<PortfolioCardClientProps> = ({
    portfolio,
    onSendProposalClick,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleProposalSubmit = (initialMessage: string) => {
        onSendProposalClick(
            portfolio._id,
            initialMessage // Pasamos solo dos argumentos
        );
    };
    
    

    return (
        <div className="max-w-md rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800 transition duration-300 relative">
            <div className="relative group">
                <img
                    src={portfolio.image}
                    alt={`Imagen del portafolio ${portfolio.title} por ${portfolio.provider.username}`}
                    className="object-cover w-full h-48 rounded-t-lg"
                />
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
                    onClick={() => setIsModalOpen(true)}
                    label="Enviar Propuesta"
                />
            </div>

            <ProposalModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleProposalSubmit}
                portfolioId={portfolio._id}
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

export default PortfolioCardClient;