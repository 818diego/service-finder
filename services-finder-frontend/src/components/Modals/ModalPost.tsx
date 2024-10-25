import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPost } from "../../services/providerFetch"; // La función createPost ajustada
import { toast } from "react-toastify";

interface ModalPostProps {
    isOpen: boolean;
    onClose: () => void;
    portfolioId: string; // El ID del portfolio
    onSubmit: (data: {
        portfolio: string;
        title: string;
        description: string;
        images: string[];
    }) => void;
}

const ModalPost: React.FC<ModalPostProps> = ({
    isOpen,
    onClose,
    portfolioId,
    onSubmit,
}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrls, setImageUrls] = useState<string[]>([""]); // Estado para las URLs de las imágenes
    const [loading, setLoading] = useState(false);

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setImageUrls([""]); // Limpiar el estado de URLs
    };

    const handleAddImageUrl = () => {
        setImageUrls([...imageUrls, ""]); // Añadir un nuevo campo de URL vacío
    };

    const handleImageUrlChange = (index: number, url: string) => {
        const newImageUrls = [...imageUrls];
        newImageUrls[index] = url;
        setImageUrls(newImageUrls); // Actualizar las URLs en el estado
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const data = {
            title,
            description,
            images: imageUrls.filter((url) => url !== ""), // Enviar solo URLs no vacías
        };

        try {
            // Crear el post asociado al portfolioId
            const result = await createPost(portfolioId, data); // Llamada a la API
            console.log("Post creado exitosamente:", result);

            toast.success("Post created successfully", {
                position: "top-right",
                autoClose: 3000,
            });

            onSubmit(result); // Enviamos la respuesta a la función de callback
            onClose();
            resetForm();
        } catch (error) {
            console.error("Error creating post:", error);
            toast.error("Error creating post. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            resetForm();
        }
    }, [isOpen]);

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
                            New Post
                        </h2>
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4 mt-4">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Title"
                                className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Description"
                                className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                            {imageUrls.map((url, index) => (
                                <div key={index} className="space-y-2">
                                    <input
                                        type="text"
                                        value={url}
                                        onChange={(e) =>
                                            handleImageUrlChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        placeholder={`Image URL ${index + 1}`}
                                        className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddImageUrl}
                                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400"
                            >
                                Add Another Image URL
                            </button>

                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500">
                                    Close
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400">
                                    {loading ? "Loading..." : "Submit"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ModalPost;
