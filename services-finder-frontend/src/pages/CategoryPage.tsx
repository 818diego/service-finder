import React, { useEffect, useState } from "react";
import { fetchAllPortfolios } from "../services/portfolioFetch";
import { Portfolio } from "../types/portfolio";
import { categoryOptions } from "../data/dropdownOptions";
import PortfolioCard from "../components/MyPortfoliosPage/PortfolioCard";

const CategoryPage: React.FC = () => {
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [filteredPortfolios, setFilteredPortfolios] = useState<Portfolio[]>(
        []
    );
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [sortOrder, setSortOrder] = useState("name-asc");

    useEffect(() => {
        const fetchPortfolios = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const portfolios = await fetchAllPortfolios(token);
                    setPortfolios(portfolios);
                    setFilteredPortfolios(portfolios); // Mostrar todos inicialmente
                }
            } catch (error) {
                console.error("Error fetching portfolios:", error);
            }
        };
        fetchPortfolios();
    }, []);

    useEffect(() => {
        let result = portfolios;

        // Filtrar por categoría
        if (selectedCategories.length > 0) {
            result = result.filter((portfolio) =>
                selectedCategories.includes(portfolio.category)
            );
        }

        // Ordenar por nombre
        if (sortOrder === "name-asc") {
            result = result.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortOrder === "name-desc") {
            result = result.sort((a, b) => b.title.localeCompare(a.title));
        }

        setFilteredPortfolios(result);
    }, [selectedCategories, sortOrder, portfolios]);

    const toggleCategory = (category: string) => {
        setSelectedCategories((prevCategories) =>
            prevCategories.includes(category)
                ? prevCategories.filter((c) => c !== category)
                : [...prevCategories, category]
        );
    };

    return (
        <div className="p-6 text-white">
            <h1 className="text-center text-2xl font-bold mb-6">
                Filtros de Categorías
            </h1>
            <div className="flex flex-col lg:flex-row gap-4">
                <aside className="w-full lg:w-1/4 p-4">
                    {/* Título del sidebar */}
                    <h2 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 flex items-center">
                        <span className="mr-2 text-blue-400">🔍</span> Ordenar
                        por
                    </h2>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500 hover:bg-gray-600 transition">
                        <option value="name-asc">Título: A - Z</option>
                        <option value="name-desc">Título: Z - A</option>
                    </select>

                    {/* Filtros */}
                    <h2 className="text-lg font-semibold mt-6 mb-4 border-b border-gray-700 pb-2 flex items-center">
                        <span className="mr-2 text-green-400">⚙️</span> Filtros
                    </h2>
                    <div className="space-y-3 max-h-64 relative overflow-auto">
                        {/* Indicador de scroll */}
                        <div className="absolute bottom-0 w-full h-4 bg-gradient-to-t from-transparent to-transparent pointer-events-none"></div>
                        {/* Contenedor con scroll */}
                        <div className="overflow-y-scroll h-full scrollbar-hide">
                            {categoryOptions.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => toggleCategory(category)}
                                    className={`w-full flex items-center px-4 py-2 transition ${
                                        selectedCategories.includes(category)
                                            ? "bg-blue-500 text-white hover:bg-blue-600"
                                            : " text-gray-300 hover:bg-gray-600 "
                                    }`}>
                                    <span className="mr-2">
                                        {selectedCategories.includes(category)
                                            ? "✅"
                                            : "⬜️"}
                                    </span>
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Botón de limpiar filtros */}
                    <button
                        onClick={() => setSelectedCategories([])}
                        className="mt-6 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition flex items-center justify-center space-x-2">
                        <span>Limpiar Filtros</span>
                    </button>
                </aside>

                {/* Grid de portfolios */}
                <section className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPortfolios.map((portfolio) => (
                        <PortfolioCard
                            key={portfolio._id}
                            providerUsername={portfolio.provider.username}
                            portfolio={portfolio}
                            isEditable={false}
                        />
                    ))}
                </section>
            </div>
        </div>
    );
};

export default CategoryPage;
