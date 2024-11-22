import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProposalModalProps {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    initialMessage: string;
    setInitialMessage: (message: string) => void;
    handleCreateChat: () => void;
}

const ProposalModal: React.FC<ProposalModalProps> = ({
    showModal,
    setShowModal,
    initialMessage,
    setInitialMessage,
    handleCreateChat,
}) => {
    const handleCreateChatWithNotification = () => {
        handleCreateChat();
    };

    return (
        <AnimatePresence>
            {showModal && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}>
                    <motion.div
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 sm:w-96"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        transition={{ duration: 0.3 }}>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            Escribe tu propuesta para el servicio
                        </h2>
                        <textarea
                            value={initialMessage}
                            onChange={(e) => setInitialMessage(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
                            placeholder="Escribe tu propuesta aquí..."
                        />
                        <div className="flex justify-end mt-4 space-x-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-700">
                                Cancelar
                            </button>
                            <button
                                onClick={handleCreateChatWithNotification}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                Enviar
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProposalModal;
