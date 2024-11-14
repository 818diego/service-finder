import React, { useState } from "react";

interface ProposalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (initialMessage: string) => void;
    portfolioId: string;
}

const ProposalModal: React.FC<ProposalModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const [initialMessage, setInitialMessage] = useState("");

    if (!isOpen) return null;

    const handleSubmit = () => {
        onSubmit(initialMessage);
        setInitialMessage("");
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 sm:w-96">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Escribe tu propuesta para el portafolio
                </h2>
                <textarea
                    value={initialMessage}
                    onChange={(e) => setInitialMessage(e.target.value)}
                    className="w-full h-24 p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="Escribe tu propuesta aquí..."
                />
                <div className="flex justify-end mt-4 space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-700"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Enviar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProposalModal;