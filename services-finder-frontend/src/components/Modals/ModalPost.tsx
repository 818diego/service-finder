import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPost } from "../../services/postFetch";
import { fetchUserServices } from "../../services/serviceFetch";
import { toast } from "react-toastify";
import { PostFormInput, PostResponse } from "../../types/post";

interface ModalPostProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: PostResponse) => void;
}

interface Service {
    _id: string;
    title: string;
    portfolio: string;
}

const ModalPost: React.FC<ModalPostProps> = ({ isOpen, onClose, onSubmit }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrls, setImageUrls] = useState<string[]>([""]);
    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState<Service[]>([]);
    const [selectedPortfolioId, setSelectedPortfolioId] = useState("");

    const resetForm = () => {
        setSelectedPortfolioId("");
        setTitle("");
        setDescription("");
        setImageUrls([""]);
    };

    const loadServices = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("No token found");
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const userId = payload.userId;
            const servicesData = await fetchUserServices(userId, token);
            console.log("Fetched services:", servicesData);
            setServices(servicesData);
            setSelectedPortfolioId(servicesData[0]?.portfolio || "");
        } catch (error) {
            console.error("Error fetching services:", error);
            toast.error("Error loading services");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const data: PostFormInput = {
            title,
            description,
            images: imageUrls.filter((url) => url !== ""),
        };

        try {
            console.log("Selected portfolio ID:", selectedPortfolioId);
            const result = await createPost(selectedPortfolioId, data);
            console.log("Post created successfully:", result);
            toast.success("Post created successfully", {
                position: "top-right",
                autoClose: 3000,
            });
            onSubmit(result);
            onClose();
            resetForm();
        } catch (error) {
            console.error("Error creating post:", error);
            toast.error("Error creating post. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddImageUrl = () => {
        setImageUrls([...imageUrls, ""]);
    };

    const handleImageUrlChange = (index: number, url: string) => {
        const newImageUrls = [...imageUrls];
        newImageUrls[index] = url;
        setImageUrls(newImageUrls);
    };

    useEffect(() => {
        if (isOpen) {
            loadServices();
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
                            <select
                                value={selectedPortfolioId}
                                onChange={(e) =>
                                    setSelectedPortfolioId(e.target.value)
                                }
                                className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required>
                                <option value="" disabled>
                                    Select a Service
                                </option>
                                {services.map((service) => (
                                    <option
                                        key={service._id}
                                        value={service.portfolio}>
                                        {service.title}
                                    </option>
                                ))}
                            </select>
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
                                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400">
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