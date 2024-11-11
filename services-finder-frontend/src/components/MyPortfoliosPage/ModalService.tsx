import React, { useState, useEffect, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { FaTimes, FaCheck, FaLock, FaUpload } from "react-icons/fa";

interface ModalServiceProps {
    isOpen: boolean;
    onClose: () => void;
    mode: "create" | "edit" | "delete";
    onSubmit: (data: FormData) => void;
    portfolioName?: string;
    portfolioId: string;
    provider: {
        id: string;
        username: string;
    };
    initialData?: {
        title: string;
        description: string;
        price?: number;
        duration?: string;
        category?: string;
        images?: string[];
    };
}

const ModalService: React.FC<ModalServiceProps> = ({
    isOpen,
    onClose,
    mode,
    onSubmit,
    portfolioName,
    portfolioId,
    provider,
    initialData,
}) => {
    const [title, setTitle] = useState(initialData?.title || "");
    const [description, setDescription] = useState(
        initialData?.description || ""
    );
    const [price, setPrice] = useState<number | "">(initialData?.price || "");
    const [duration, setDuration] = useState(initialData?.duration || "");
    const [category, setCategory] = useState(initialData?.category || "");
    const [images, setImages] = useState<FileList | null>(null);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen && mode === "create") {
            console.log("Provider:", provider);
        }
    }, [isOpen, mode, portfolioId, provider]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(e.target.files);

            // Generate previews for each selected image
            const newPreviews = Array.from(e.target.files).map((file) =>
                URL.createObjectURL(file)
            );
            setImagePreviews((prevPreviews) => [
                ...prevPreviews,
                ...newPreviews,
            ]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (price && price < 0) {
            toast.error("El precio no puede ser negativo.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("portfolioId", portfolioId);
        formData.append("price", String(price));

        if (duration) formData.append("duration", duration);
        if (category) formData.append("category", category);

        if (images) {
            Array.from(images).forEach((file) => {
                formData.append("images", file);
            });
        }

        onSubmit(formData);
        onClose();
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
                            {mode === "create"
                                ? "Crear Servicio"
                                : "Editar Servicio"}
                        </h2>
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4 mt-4">
                            {/* Provider display as disabled input with lock icon */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Proveedor
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={provider.username}
                                        readOnly
                                        disabled
                                        className="w-full px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white focus:outline-none cursor-not-allowed"
                                    />
                                    <FaLock className="absolute right-3 top-3 text-gray-500" />
                                </div>
                            </div>

                            {/* Portfolio name display as disabled input with lock icon */}
                            {mode === "create" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Portfolio
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={portfolioName}
                                            readOnly
                                            disabled
                                            className="w-full px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white focus:outline-none cursor-not-allowed"
                                            placeholder="Portfolio seleccionado"
                                        />
                                        <FaLock className="absolute right-3 top-3 text-gray-500" />
                                    </div>
                                </div>
                            )}

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Título
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Título"
                                    className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            {/* Description */}
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

                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Precio
                                </label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) =>
                                        setPrice(
                                            e.target.value === ""
                                                ? ""
                                                : Number(e.target.value)
                                        )
                                    }
                                    placeholder="Precio"
                                    className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            {/* Additional fields for edit mode */}
                            {mode === "edit" && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Duración
                                        </label>
                                        <input
                                            type="text"
                                            value={duration}
                                            onChange={(e) =>
                                                setDuration(e.target.value)
                                            }
                                            placeholder="Duración"
                                            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Categoría
                                        </label>
                                        <input
                                            type="text"
                                            value={category}
                                            onChange={(e) =>
                                                setCategory(e.target.value)
                                            }
                                            placeholder="Categoría"
                                            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            {/* Image upload with multiple previews */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {mode === "create"
                                        ? "Subir Imágenes"
                                        : "Actualizar Imágenes"}
                                </label>
                                <div className="mt-1 flex items-center">
                                    <label
                                        htmlFor="file-upload"
                                        className="ml-5 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 cursor-pointer flex items-center">
                                        <FaUpload className="mr-2" />
                                        <span>Seleccionar Imágenes</span>
                                        <input
                                            id="file-upload"
                                            name="file-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            multiple
                                            className="sr-only"
                                        />
                                    </label>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {imagePreviews.map((src, index) => (
                                        <img
                                            key={index}
                                            src={src}
                                            alt={`Preview ${index + 1}`}
                                            className="w-16 h-16 object-cover rounded-md"
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 flex items-center">
                                    <FaTimes className="mr-2" /> Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 flex items-center">
                                    <FaCheck className="mr-2" />{" "}
                                    {mode === "create" ? "Crear" : "Actualizar"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ModalService;
