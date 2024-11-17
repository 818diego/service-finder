import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
    title: string;
    onClose: () => void;
    onSubmit: (message: string) => void;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, onSubmit }) => {
    const [message, setMessage] = useState("");

    const handleSubmit = () => {
        onSubmit(message);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                        {title}
                    </h2>
                    <textarea
                        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg mb-4 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700"
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <div className="flex justify-end space-x-2">
                        <button
                            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition duration-200"
                            onClick={onClose}>
                            Cancelar
                        </button>
                        <button
                            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition duration-200"
                            onClick={handleSubmit}>
                            Enviar
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Modal;
