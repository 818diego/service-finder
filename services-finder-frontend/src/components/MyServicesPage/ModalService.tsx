import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalServiceProps {
    isOpen: boolean;
    onClose: () => void;
    mode: "create" | "edit" | "delete";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSubmit: (data: any) => void;
    initialData?: {
        title: string;
        description: string;
        price?: number;
        duration?: string;
        category?: string;
        images?: string[];
    };
    serviceId?: string;
}

const ModalService: React.FC<ModalServiceProps> = ({
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
    const [price, setPrice] = useState<number | "">(initialData?.price || "");
    const [duration, setDuration] = useState(initialData?.duration || "");
    const [category, setCategory] = useState(initialData?.category || "");
    const [imageUrls, setImageUrls] = useState<string[]>(
        initialData?.images || [""]
    );

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setPrice("");
        setDuration("");
        setCategory("");
        setImageUrls([""]);
    };

    useEffect(() => {
        if (mode === "edit" && initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description);
            setPrice(initialData.price || "");
            setDuration(initialData.duration || "");
            setCategory(initialData.category || "");
        } else if (mode === "create") {
            resetForm();
        }
    }, [initialData, mode]);

    const handleAddImageUrl = () => {
        setImageUrls([...imageUrls, ""]);
    };

    const handleImageUrlChange = (index: number, url: string) => {
        const newImageUrls = [...imageUrls];
        newImageUrls[index] = url;
        setImageUrls(newImageUrls);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
            title,
            description,
            ...(mode === "create"
                ? { images: imageUrls.filter((url) => url !== "") }
                : {}),
            ...(mode !== "create"
                ? { price: Number(price), duration, category }
                : {}),
        };
        onSubmit(data);
        resetForm();
        onClose();
    };

    const handleDelete = () => {
        onSubmit({
            title: "",
            description: "",
            price: 0,
            duration: "",
            category: "",
        });
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
                        {mode === "delete" ? (
                            <>
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                    Confirm Delete
                                </h2>
                                <p className="mt-4 text-gray-600 dark:text-gray-300">
                                    Are you sure you want to delete this
                                    service?
                                </p>
                                <div className="flex justify-end space-x-2 mt-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500">
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500">
                                        Delete
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                    {mode === "create"
                                        ? "New Post"
                                        : "Edit Service"}
                                </h2>
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4 mt-4">
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                        placeholder="Title"
                                        className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                    <textarea
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                        placeholder="Description"
                                        className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                    {mode === "create" ? (
                                        <>
                                            {imageUrls.map((url, index) => (
                                                <div
                                                    key={index}
                                                    className="space-y-2">
                                                    <input
                                                        type="text"
                                                        value={url}
                                                        onChange={(e) =>
                                                            handleImageUrlChange(
                                                                index,
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder={`Image URL ${
                                                            index + 1
                                                        }`}
                                                        className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                    />
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={handleAddImageUrl}
                                                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400">
                                                Add Another Image URL
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <input
                                                type="number"
                                                value={price}
                                                onChange={(e) =>
                                                    setPrice(
                                                        Number(
                                                            e.target.value
                                                        ) || ""
                                                    )
                                                }
                                                placeholder="Price"
                                                className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                required
                                            />
                                            <input
                                                type="text"
                                                value={duration}
                                                onChange={(e) =>
                                                    setDuration(e.target.value)
                                                }
                                                placeholder="Duration"
                                                className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                required
                                            />
                                            <input
                                                type="text"
                                                value={category}
                                                onChange={(e) =>
                                                    setCategory(e.target.value)
                                                }
                                                placeholder="Category"
                                                className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                required
                                            />
                                        </>
                                    )}
                                    <div className="flex justify-end space-x-2 mt-4">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500">
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400">
                                            Submit
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

export default ModalService;
