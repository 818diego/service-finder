import React, { useEffect, useState } from "react";
import { getPostsByPortfolioId, deletePost, updatePost } from "../../../services/postFetch";
import { fetchUserServices } from "../../../services/serviceFetch";
import { PostResponse } from "../../../types/post";
import PostCard from "../../../components/MyPostPage/PostCard";
import ModalPost from "../../../components/MyPostPage/PostModal";
import { Service } from "../../../types/service";
import { toast } from "react-toastify";

const decodeToken = (token: string) => {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.userId;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};

const MyPostPage: React.FC = () => {
    const [posts, setPosts] = useState<PostResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState<Service[]>([]);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"edit" | "delete">("edit");
    const [selectedPost, setSelectedPost] = useState<PostResponse | null>(null);

    useEffect(() => {
        let userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!userId && token) {
            userId = decodeToken(token);
            if (userId) {
                localStorage.setItem("userId", userId);
            }
        }

        if (!userId || !token) return;

        const fetchServices = async () => {
            try {
                const fetchedServices = await fetchUserServices(userId, token);
                if (Array.isArray(fetchedServices) && fetchedServices.length > 0) {
                    setServices(fetchedServices);
                }
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        };

        fetchServices();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            if (!selectedService || !selectedService.portfolio) return;
            setLoading(true);
            try {
                const fetchedPosts = await getPostsByPortfolioId(selectedService.portfolio);
                setPosts(fetchedPosts);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [selectedService]);

    const handleServiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedServiceId = event.target.value;
        const service = services.find((service) => service._id === selectedServiceId) || null;
        setSelectedService(service);
    };

    const handleDeletePost = async (postId: string) => {
        try {
            await deletePost(postId);
            setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
            toast.success("Post deleted successfully.", {
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    const openModal = (mode: "edit" | "delete", post: PostResponse) => {
        setModalMode(mode);
        setSelectedPost(post);
        setModalOpen(true);
    };

    const handleModalSubmit = async (data: {
        title?: string;
        description?: string;
        images?: string[];
    }) => {
        if (modalMode === "edit" && selectedPost) {
            try {
                const updatedPost = await updatePost(selectedPost._id, {
                    title: data.title || selectedPost.title,
                    description: data.description || selectedPost.description,
                    images: data.images || selectedPost.images,
                });
                setPosts((prevPosts) =>
                    prevPosts.map((post) => (post._id === selectedPost._id ? updatedPost : post))
                );
                toast.success("Post updated successfully.", {
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } catch (error) {
                console.error("Error updating post:", error);
            }
        } else if (modalMode === "delete" && selectedPost) {
            handleDeletePost(selectedPost._id);
        }
        setModalOpen(false);
    };

    return (
        <div className="overflow-hidden sm:rounded-lg transition-colors duration-300 ease-in-out">
            <div className="px-4 py-5 sm:px-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Welcome to MyPostPage
                </h1>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-300">
                    Select a service to view its posts.
                </p>
            </div>
            <div className="px-4 py-5 sm:px-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select a service:
                </label>
                <div className="relative mt-2">
                    <select
                        onChange={handleServiceChange}
                        className="block w-full py-2 pl-3 pr-10 bg-white dark:bg-gray-700 dark:text-white text-gray-900 rounded-md shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <option value="" className="text-gray-400">
                            Choose a service
                        </option>
                        {services.map((service) => (
                            <option key={service._id} value={service._id}>
                                {service.title}
                            </option>
                        ))}
                    </select>
                    {!selectedService && (
                        <p className="mt-2 text-sm text-red-500 animate-pulse">
                            Please select a service to view posts.
                        </p>
                    )}
                </div>

                {selectedService && (
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                            Posts
                        </h2>
                        {loading ? (
                            <p className="text-gray-500 dark:text-gray-400 animate-pulse">
                                Loading posts...
                            </p>
                        ) : posts.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4 transition-opacity duration-300 ease-in-out opacity-100">
                                {posts.map((post) => (
                                    <PostCard
                                        key={post._id}
                                        post={post}
                                        onEditPostClick={() => openModal("edit", post)}
                                        onDeletePostClick={() => openModal("delete", post)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 animate-pulse">
                                No posts available.
                            </p>
                        )}
                    </div>
                )}
            </div>
            <ModalPost
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                mode={modalMode}
                onSubmit={handleModalSubmit}
                initialData={modalMode === "edit" && selectedPost ? selectedPost : undefined}
            />
        </div>
    );
};

export default MyPostPage;
