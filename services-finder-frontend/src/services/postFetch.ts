import { PostFormInput, PostResponse } from "../types/post";

const API_URL = import.meta.env.VITE_API_URL;

export const createPost = async (
    portfolioId: string,
    data: PostFormInput
): Promise<PostResponse> => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No token available");
    }

    try {
        const postResponse = await fetch(
            `${API_URL}/api/post/portfolio/${portfolioId}/add-create-posts`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(data),
            }
        );

        if (postResponse.ok) {
            return await postResponse.json();
        } else {
            const errorText = await postResponse.text();
            throw new Error(`Unexpected response format: ${errorText}`);
        }
    } catch (error) {
        console.error("Error during post creation process:", error);
        throw error;
    }
};

export const getPostsByPortfolioId = async (
    portfolioId: string
): Promise<PostResponse[]> => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No token available");
    }

    try {
        const postResponse = await fetch(
            `${API_URL}/api/post/portfolio/${portfolioId}/posts`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        );

        if (postResponse.ok) {
            return await postResponse.json();
        } else {
            const errorText = await postResponse.text();
            throw new Error(`Unexpected response format: ${errorText}`);
        }
    } catch (error) {
        console.error("Error during post retrieval process:", error);
        throw error;
    }
};

export const deletePost = async (postId: string): Promise<void> => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No token available");
    }

    try {
        const postResponse = await fetch(
            `${API_URL}/api/post/${postId}/delete`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        );

        if (!postResponse.ok) {
            const errorText = await postResponse.text();
            throw new Error(`Failed to delete post: ${errorText}`);
        }
        console.log("Post deleted successfully");
    } catch (error) {
        console.error("Error during post deletion process:", error);
        throw error;
    }
};

export const updatePost = async (
    postId: string,
    data: PostFormInput
): Promise<PostResponse> => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No token available");
    }

    try {
        const postResponse = await fetch(
            `${API_URL}/api/post/${postId}/update`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(data),
            }
        );

        if (postResponse.ok) {
            return await postResponse.json();
        } else {
            const errorText = await postResponse.text();
            throw new Error(`Unexpected response format: ${errorText}`);
        }
    } catch (error) {
        console.error("Error during post update process:", error);
        throw error;
    }
};
