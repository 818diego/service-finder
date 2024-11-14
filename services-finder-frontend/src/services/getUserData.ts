export const getUserData = async (): Promise<string> => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No token available");
    }

    // Decodificamos el token para obtener el userId
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const userId = decodedToken.userId;

    try {
        const userResponse = await fetch(
            `http://node2.frokie.it/api/users/${userId}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        );

        if (!userResponse.ok) {
            throw new Error("Failed to fetch user data");
        }

        const userData = await userResponse.json();
        console.log("User data retrieved:", userData);

        const portfolioId = userData.portfolios[0]?._id;
        if (!portfolioId) {
            throw new Error("No portfolio ID found for the user");
        }

        return portfolioId;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
};
