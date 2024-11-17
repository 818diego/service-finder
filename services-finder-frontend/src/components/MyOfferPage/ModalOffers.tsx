import React, { useState, useEffect, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { categoryOptions } from "../../data/dropdownOptions";
import { toast } from "react-toastify";
import { FaTimes, FaCheck, FaUpload, FaTrash } from "react-icons/fa";
import { OfferForm, Offer } from "../../types/offer";

interface ModalOffersProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (offerData: OfferForm) => void;
    onDelete?: () => void;
    mode: "create" | "edit" | "delete";
    initialData?: Offer;
}

const ModalOffers: React.FC<ModalOffersProps> = ({
    isOpen,
    onClose,
    onConfirm,
    onDelete,
    mode,
    initialData,
}) => {
    const [title, setTitle] = useState(initialData?.title || "");
    const [description, setDescription] = useState(
        initialData?.description || ""
    );
    const [category, setCategory] = useState(initialData?.category || "");
    const [budget, setBudget] = useState<number | "">(
        initialData?.budget || ""
    );
    const [status, setStatus] = useState<string>(
        initialData?.status || "Activo"
    );
    const [images, setImages] = useState<File[] | null>(null);
    const [imagePreviews, setImagePreviews] = useState<string[]>(
        initialData?.images || []
    );
    const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen && initialData && mode === "edit") {
            setTitle(initialData.title);
            setDescription(initialData.description);
            setCategory(initialData.category);
            setBudget(initialData.budget);
            setStatus(initialData.status);
            setImagePreviews(initialData.images);
            setImagesToDelete([]);
        }
    }, [isOpen, initialData, mode]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            const newPreviews = selectedFiles.map((file) =>
                URL.createObjectURL(file)
            );
            setImages((prevImages) =>
                prevImages ? [...prevImages, ...selectedFiles] : selectedFiles
            );
            setImagePreviews((prevPreviews) => [
                ...prevPreviews,
                ...newPreviews,
            ]);
        }
    };

    const handleRemoveImage = (url: string) => {
        if (initialData?.images.includes(url)) {
            setImagesToDelete((prev) =>
                prev.includes(url)
                    ? prev.filter((img) => img !== url)
                    : [...prev, url]
            );
        }
        setImagePreviews((prevPreviews) =>
            prevPreviews.filter((img) => img !== url)
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (budget !== "" && budget < 0) {
            toast.error("El presupuesto no puede ser negativo.");
            return;
        }
        const offerData: OfferForm = {
            title,
            description,
            category,
            budget: Number(budget),
            status,
            images: imagePreviews,
            removeImageUrls:
                imagesToDelete.length > 0 ? imagesToDelete : undefined,
            files: images || undefined,
        };
        onConfirm(offerData);
        clearImages();
        onClose();
    };

    const handleDeleteConfirm = () => {
        if (onDelete) {
            onDelete();
        }
        clearImages();
        onClose();
    };

    const clearImages = () => {
        imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
        setImages(null);
        setImagePreviews([]);
        setImagesToDelete([]);
    };

    const handleClose = () => {
        clearImages();
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
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                        }}>
                        <button
                            onClick={handleClose}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
                            aria-label="Close Modal">
                            <FaTimes size={20} />
                        </button>
                        {mode === "delete" ? (
                            <div className="text-center">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                    Confirmar eliminación
                                </h2>
                                <p className="mt-4 text-gray-600 dark:text-gray-300">
                                    ¿Estás seguro de que deseas eliminar la
                                    oferta{" "}
                                    <span className="font-semibold">
                                        {title}
                                    </span>
                                    ?
                                </p>
                                <div className="flex justify-center space-x-4 mt-6">
                                    <button
                                        onClick={handleDeleteConfirm}
                                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 ease-in-out">
                                        Confirmar
                                    </button>
                                    <button
                                        onClick={handleClose}
                                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-200 ease-in-out">
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                    {mode === "create"
                                        ? "Crear Oferta"
                                        : "Editar Oferta"}
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
                                            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none"
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
                                            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none"
                                            required
                                        />
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
                                            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none"
                                            required>
                                            <option
                                                value=""
                                                className="opacity-50">
                                                Seleccionar Categoría
                                            </option>
                                            {categoryOptions.map((option) => (
                                                <option
                                                    key={option}
                                                    value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Presupuesto
                                        </label>
                                        <input
                                            type="number"
                                            value={budget}
                                            onChange={(e) =>
                                                setBudget(
                                                    e.target.value === ""
                                                        ? ""
                                                        : Number(e.target.value)
                                                )
                                            }
                                            placeholder="Presupuesto"
                                            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Estado
                                        </label>
                                        <select
                                            value={status}
                                            onChange={(e) =>
                                                setStatus(e.target.value)
                                            }
                                            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none">
                                            <option value="Activo">
                                                Activo
                                            </option>
                                            <option value="No disponible">
                                                No disponible
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {mode === "create"
                                                ? "Subir Imágenes"
                                                : "Actualizar Imágenes"}
                                        </label>
                                        <div className="mt-1 flex items-center">
                                            <label
                                                htmlFor="file-upload"
                                                className="ml-5 rounded-md font-medium text-indigo-600 dark:text-indigo-400 cursor-pointer flex items-center">
                                                <FaUpload className="mr-2" />
                                                <span>
                                                    Seleccionar Imágenes
                                                </span>
                                                <input
                                                    id="file-upload"
                                                    name="images"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    multiple
                                                    className="sr-only"
                                                />
                                            </label>
                                        </div>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {imagePreviews.map((url, index) => (
                                                <div
                                                    key={url + index}
                                                    className="relative">
                                                    <img
                                                        src={url}
                                                        alt={`Preview ${index}`}
                                                        className="w-16 h-16 object-cover rounded-md"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveImage(
                                                                url
                                                            )
                                                        }
                                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                        aria-label="Eliminar Imagen">
                                                        <FaTrash size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {mode === "edit" && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                ¿Qué imágenes quieres eliminar?
                                            </label>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Haz clic en el icono de la
                                                papelera en cada imagen para
                                                eliminarla.
                                            </p>
                                        </div>
                                    )}
                                    <div className="flex justify-end space-x-2 mt-4">
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            className="flex items-center px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition duration-200 ease-in-out">
                                            <FaTimes className="mr-2" />
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 dark:hover:bg-indigo-700 transition duration-200 ease-in-out">
                                            <FaCheck className="mr-2" />
                                            {mode === "create"
                                                ? "Crear"
                                                : "Actualizar"}
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

export default ModalOffers;
