export const fetchUserPortfolios = async (userId: string, token: string) => {
    const response = await fetch(
        `http://localhost:3000/api/portfolios/user/${userId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        }
    );

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
            `Error fetching portfolios: ${response.status} - ${errorData}`
        );
    }

    return await response.json();
};
