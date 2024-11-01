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
            `http://localhost:3000/api/post/portfolio/${portfolioId}/add-create-posts`,
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
