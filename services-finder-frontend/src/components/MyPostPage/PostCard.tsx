import React, { useState } from "react";
import { FaTrash, FaEdit, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { PostResponse } from "../../types/post";

interface PostCardProps {
    post: PostResponse;
    onEditPostClick: () => void;
    onDeletePostClick: () => void;
}

const PostCard: React.FC<PostCardProps> = ({
    post,
    onEditPostClick,
    onDeletePostClick,
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        setCurrentImageIndex(
            (prevIndex) => (prevIndex + 1) % (post.images?.length || 1)
        );
    };

    const prevImage = () => {
        setCurrentImageIndex(
            (prevIndex) =>
                (prevIndex - 1 + (post.images?.length || 1)) %
                (post.images?.length || 1)
        );
    };

    return (
        <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800 transition duration-300 p-4 space-y-4 transform hover:shadow-xl">
            <div className="relative group">
                {post.images && post.images.length > 0 ? (
                    <>
                        <img
                            src={post.images[currentImageIndex]}
                            alt={post.title}
                            className="w-full h-48 object-contain rounded-lg transition-opacity duration-300 ease-in-out"
                        />
                        {post.images.length > 1 && (
                            <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <button
                                    onClick={prevImage}
                                    className="bg-gray-700 bg-opacity-60 hover:bg-opacity-80 p-2 rounded-full text-white">
                                    <FaChevronLeft />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="bg-gray-700 bg-opacity-60 hover:bg-opacity-80 p-2 rounded-full text-white">
                                    <FaChevronRight />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="w-full h-32 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg">
                        <span className="text-gray-400 dark:text-gray-500">
                            No Image Available
                        </span>
                    </div>
                )}
            </div>
            <div className="text-start">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {post.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                    {post.description}
                </p>
            </div>
            <div className="flex justify-center mt-4 space-x-4">
                <button
                    className="flex items-center justify-center space-x-2 bg-transparent text-green-600 dark:text-green-400 font-medium text-sm focus:outline-none hover:underline"
                    onClick={onEditPostClick}>
                    <FaEdit className="text-lg" />
                    <span>Edit</span>
                </button>
                <button
                    className="flex items-center justify-center space-x-2 bg-transparent text-red-600 dark:text-red-400 font-medium text-sm focus:outline-none hover:underline"
                    onClick={onDeletePostClick}>
                    <FaTrash className="text-lg" />
                    <span>Delete</span>
                </button>
            </div>
        </div>
    );
};

export default PostCard;
