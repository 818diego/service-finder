import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { categoryOptions } from "../../data/dropdownOptions";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";

interface ModalOfferProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (offerData: {
        title: string;
        description: string;
        category: string;
        budget: number;
        status: boolean;
        images: string[];
    }) => void;
}

const ModalOffer: React.FC<ModalOfferProps> = ({
    isOpen,
    onClose,
    onConfirm,
}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [budget, setBudget] = useState("");
    const [status, setStatus] = useState(true);
    const [images, setImages] = useState<string[]>([""]);

    const isValidUrl = (url: string) => {
        return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i.test(url);
    };

    const validateFields = () => {
        if (!title.trim()) {
            toast.error("El título es obligatorio.");
            return false;
        }
        if (!description.trim()) {
            toast.error("La descripción es obligatoria.");
            return false;
        }
        if (!category) {
            toast.error("La categoría es obligatoria.");
            return false;
        }
        if (!budget || isNaN(parseFloat(budget)) || parseFloat(budget) <= 0) {
            toast.error("El presupuesto debe ser un número positivo.");
            return false;
        }
        if (images.length === 0 || !images.some((url) => url.trim() !== "")) {
            toast.error("Debes ingresar al menos una URL de imagen.");
            return false;
        }
        if (!images.every((url) => isValidUrl(url))) {
            toast.error("Todas las URLs de imagen deben ser válidas.");
            return false;
        }
        return true;
    };

    const handleConfirm = () => {
        if (!validateFields()) return;

        const offerData = {
            title,
            description,
            category,
            budget: parseFloat(budget),
            status,
            images: images.filter((url) => url.trim() !== ""),
        };
        onConfirm(offerData);
        onClose();
    };

    const handleImageChange = (index: number, value: string) => {
        const updatedImages = [...images];
        updatedImages[index] = value;
        setImages(updatedImages);
    };

    const addImageField = () => {
        setImages([...images, ""]);
    };

    const removeImageField = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    return (
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
                            Crear Oferta
                        </h2>
                        <div className="mt-4 space-y-4">
                            <input
                                type="text"
                                placeholder="Título de la Oferta"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-2 rounded-lg dark:bg-gray-700 dark:text-white"
                            />
                            <textarea
                                placeholder="Descripción de la Oferta"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-2 rounded-lg dark:bg-gray-700 dark:text-white"
                            />
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required>
                                <option value="" className="opacity-50">
                                    Seleccionar Categoría
                                </option>
                                {categoryOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                placeholder="Presupuesto"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                className="w-full p-2 rounded-lg dark:bg-gray-700 dark:text-white"
                            />
                            <select
                                value={status ? "Activo" : "No disponible"}
                                onChange={(e) =>
                                    setStatus(e.target.value === "Activo")
                                }
                                className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="Activo">Activo</option>
                                <option value="No disponible">
                                    No disponible
                                </option>
                            </select>
                            <div>
                                <label className="block text-gray-800 dark:text-white">
                                    URLs de Imágenes
                                </label>
                                {images.map((image, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-2 mt-2">
                                        <input
                                            type="text"
                                            placeholder={`Imagen URL ${
                                                index + 1
                                            }`}
                                            value={image}
                                            onChange={(e) =>
                                                handleImageChange(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            className="w-full p-2 rounded-lg dark:bg-gray-700 dark:text-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeImageField(index)
                                            }
                                            className="px-2 py-1 bg-red-600 text-white text-sm rounded-lg">
                                            Eliminar
                                        </button>
                                    </div>
                                ))}
                                <div className="flex justify-center mt-2">
                                    <button
                                        type="button"
                                        onClick={addImageField}
                                        className="flex justify-center items-center bg-indigo-500 text-white p-2 rounded-full hover:bg-indigo-400 transition-all duration-300 transform hover:scale-105 w-8 h-8">
                                        <FaPlus />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2 mt-6">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500">
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500">
                                Crear Oferta
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ModalOffer;
