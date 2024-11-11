import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalServicesAllProps {
    onClose: () => void;
    providerUsername: string;
}

const ModalServicesAll: React.FC<ModalServicesAllProps> = ({
    onClose,
    providerUsername,
}) => {
    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}>
                <motion.div
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-3xl mx-4 relative"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}>
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
                        aria-label="Close Modal">
                        <X size={24} />
                    </button>

                    {/* Modal Content */}
                    <h2 className="text-xl font-bold">
                        Servicios de {providerUsername}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                        Explora los proyectos y servicios ofrecidos por{" "}
                        {providerUsername}.
                    </p>

                    <div className="grid grid-cols-3 gap-4 mt-4">
                        {/* Example service/project items */}
                        <div className="text-center p-4 border rounded-lg">
                            <div className="text-gray-500">
                                No image available
                            </div>
                            <button className="mt-4 text-blue-500 hover:underline">
                                Ver proyecto
                            </button>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                            <div className="text-gray-500">
                                No image available
                            </div>
                            <button className="mt-4 text-blue-500 hover:underline">
                                Ver proyecto
                            </button>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                            <div className="text-gray-500">
                                No image available
                            </div>
                            <button className="mt-4 text-blue-500 hover:underline">
                                Ver proyecto
                            </button>
                        </div>
                        {/* Add additional items as needed */}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ModalServicesAll;
