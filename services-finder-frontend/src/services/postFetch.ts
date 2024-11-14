import { PostFormInput, PostResponse } from "../types/post";

export const createPost = async (
    portfolioId: string,
    data: PostFormInput
): Promise<PostResponse> => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No token available");
    }

    try {
        console.log("Using portfolio ID:", portfolioId);

        const postResponse = await fetch(
            `http://node2.frokie.it/api/post/portfolio/${portfolioId}/add-create-posts`,
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

        const contentType = postResponse.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const result: PostResponse = await postResponse.json();
            console.log("Post created successfully:", result);
            return result;
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
            `http://node2.frokie.it/api/post/portfolio/${portfolioId}/posts`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        );
        const contentType = postResponse.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const result: PostResponse[] = await postResponse.json();
            console.log("Posts retrieved successfully:", result);
            return result;
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
            `http://node2.frokie.it/api/post/${postId}/delete`,
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
            `http://node2.frokie.it/api/post/${postId}/update`,
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
        const contentType = postResponse.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const result: PostResponse = await postResponse.json();
            console.log("Post updated successfully:", result);
            return result;
        } else {
            const errorText = await postResponse.text();
            throw new Error(`Unexpected response format: ${errorText}`);
        }
    } catch (error) {
        console.error("Error during post update process:", error);
        throw error;
    }
};
