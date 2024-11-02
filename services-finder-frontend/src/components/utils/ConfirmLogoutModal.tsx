// ConfirmLogoutModal.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmLogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmLogoutModal: React.FC<ConfirmLogoutModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
}) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}>
                <motion.div
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                    }}>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Confirm Logout
                    </h2>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">
                        Are you sure you want to log out?
                    </p>
                    <div className="flex justify-end space-x-2 mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500">
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500">
                            Logout
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

export default ConfirmLogoutModal;
