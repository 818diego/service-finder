export const createService = async (data: {
    title: string;
    description: string;
    price: number;
    duration: string;
    category: string;
}) => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No token available");
    }

    try {
        const response = await fetch(
            "http://localhost:3000/api/services/create",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(data),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }

        const result = await response.json();
        console.log("Service created successfully:", result);
        return result;
    } catch (error) {
        console.error("Error creating service:", error);
        throw error;
    }
};

export const createPost = async (
    portfolioId: string,
    data: { title: string; description: string; images: string[] }
) => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No token available");
    }

    try {
        const response = await fetch(
            `http://localhost:3000/api/posts/portfolio/${portfolioId}/create-post`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(data),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }

        const result = await response.json();
        console.log("Post created successfully:", result);
        return result;
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
};
