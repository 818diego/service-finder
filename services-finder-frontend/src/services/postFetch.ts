import { PostFormInput, PostResponse } from "../types/post";

export const createPost = async (
    data: PostFormInput
): Promise<PostResponse> => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No token available");
    }

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.userId;

        if (!userId) {
            throw new Error("User ID not found in token");
        }
        console.log("Decoded userId from token:", userId);

        const userResponse = await fetch(
            `http://localhost:3000/api/users/${userId}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            }
        );

        if (!userResponse.ok) {
            const errorData = await userResponse.text();
            throw new Error(
                `Error fetching user: ${userResponse.status} - ${errorData}`
            );
        }

        const userData = await userResponse.json();
        const portfolioId = userData.portfolios?.[0]?._id;

        if (!portfolioId) {
            throw new Error("No portfolio found for user");
        }
        console.log("Extracted portfolioId:", portfolioId);

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
