import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
    durationOptions,
    categoryOptions,
} from "../../../data/dropdownOptions";
import { FaTrash, FaTimes, FaUpload, FaCheck } from "react-icons/fa";

interface ModalPortfolioProps {
    isOpen: boolean;
    onClose: () => void;
    mode: "create" | "edit" | "delete";
    onSubmit: (data: PortfolioForm) => void;
    initialData?: {
        title: string;
        description: string;
        duration?: string;
        category?: string;
        image?: string;
    };
}

export interface PortfolioForm {
    title: string;
    description: string;
    duration: string;
    category: string;
    image?: File;
}

const ModalPortfolio: React.FC<ModalPortfolioProps> = ({
    isOpen,
    onClose,
    mode,
    onSubmit,
    initialData,
}) => {
    const [title, setTitle] = useState(initialData?.title || "");
    const [description, setDescription] = useState(
        initialData?.description || ""
    );
    const [duration, setDuration] = useState(initialData?.duration || "");
    const [category, setCategory] = useState(initialData?.category || "");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        initialData?.image || null
    );
    const [isUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setDuration("");
        setCategory("");
        setSelectedImage(null);
        setImagePreview(null);
    };

    useEffect(() => {
        if (mode === "edit" && initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description);
            setDuration(initialData.duration || "");
            setCategory(initialData.category || "");
            setImagePreview(initialData.image || null);
        } else if (mode === "create") {
            resetForm();
        }
    }, [initialData, mode]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Validar tipo de archivo
            if (!file.type.startsWith("image/")) {
                toast.error(
                    "Por favor, selecciona un archivo de imagen válido."
                );
                return;
            }
            // Validar tamaño (por ejemplo, máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("La imagen debe ser menor a 5MB.");
                return;
            }
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!duration) {
            toast.error("Por favor, selecciona una duración.");
            setIsLoading(false);
            return;
        }

        if (!category) {
            toast.error("Por favor, selecciona una categoría.");
            setIsLoading(false);
            return;
        }

        const data: PortfolioForm = {
            title,
            description,
            duration,
            category,
            image: selectedImage || undefined,
        };

        onSubmit(data);
        resetForm();
        onClose();
        setIsLoading(false);
    };

    const handleDelete = () => {
        setIsLoading(true);
        onSubmit({
            title: "",
            description: "",
            duration: "",
            category: "",
            image: undefined,
        });
        onClose();
        setIsLoading(false);
    };

    useEffect(() => {
        return () => {
            if (imagePreview && initialData?.image) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview, initialData]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}>
                    {isLoading && (
                        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                            <div className="loader"></div>
                        </div>
                    )}
                    <motion.div
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md overflow-auto"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                        }}>
                        {mode === "delete" ? (
                            <>
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                    Confirmar Eliminación
                                </h2>
                                <p className="mt-4 text-gray-600 dark:text-gray-300">
                                    ¿Estás seguro de que deseas eliminar este
                                    portafolio?
                                </p>
                                <div className="flex justify-end space-x-2 mt-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 flex items-center">
                                        <FaTimes className="mr-2" />
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 flex items-center">
                                        <FaTrash className="mr-2" />
                                        Eliminar
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                    {mode === "create"
                                        ? "Nuevo Portafolio"
                                        : "Editar Portafolio"}
                                </h2>
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4 mt-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Título
                                        </label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) =>
                                                setTitle(e.target.value)
                                            }
                                            placeholder="Título"
                                            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Descripción
                                        </label>
                                        <textarea
                                            value={description}
                                            onChange={(e) =>
                                                setDescription(e.target.value)
                                            }
                                            placeholder="Descripción"
                                            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Imagen del Portafolio
                                        </label>
                                        <div className="mt-1 flex items-center">
                                            <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                                                {imagePreview ? (
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <svg
                                                        className="h-full w-full text-gray-300 dark:text-gray-500"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path d="M24 20.993V24H0v-2.993C0 18.816 4.686 15 10.824 15h2.352C19.314 15 24 18.816 24 20.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                                    </svg>
                                                )}
                                            </span>
                                            <label
                                                htmlFor="file-upload"
                                                className="ml-5 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 cursor-pointer flex items-center">
                                                <FaUpload className="mr-2" />
                                                <span>Seleccionar Imagen</span>
                                                <input
                                                    id="file-upload"
                                                    name="file-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="sr-only"
                                                />
                                            </label>
                                        </div>
                                        {selectedImage && (
                                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                {selectedImage.name}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Duración
                                        </label>
                                        <select
                                            value={duration}
                                            onChange={(e) =>
                                                setDuration(e.target.value)
                                            }
                                            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required>
                                            <option value="" disabled>
                                                Seleccione Duración
                                            </option>
                                            {durationOptions.map(
                                                (option, index) => (
                                                    <option
                                                        key={index}
                                                        value={option}>
                                                        {option}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Categoría
                                        </label>
                                        <select
                                            value={category}
                                            onChange={(e) =>
                                                setCategory(e.target.value)
                                            }
                                            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required>
                                            <option value="" disabled>
                                                Seleccione Categoría
                                            </option>
                                            {categoryOptions.map(
                                                (option, index) => (
                                                    <option
                                                        key={index}
                                                        value={option}>
                                                        {option}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                    <div className="flex justify-end space-x-2 mt-4">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 flex items-center">
                                            <FaTimes className="mr-2" />
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isUploading}
                                            className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 flex items-center ${
                                                isUploading
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                            }`}>
                                            {isUploading ? (
                                                <>
                                                    <FaUpload className="mr-2" />
                                                    Subiendo...
                                                </>
                                            ) : (
                                                <>
                                                    <FaCheck className="mr-2" />
                                                    {mode === "create"
                                                        ? "Crear"
                                                        : "Actualizar"}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ModalPortfolio;
