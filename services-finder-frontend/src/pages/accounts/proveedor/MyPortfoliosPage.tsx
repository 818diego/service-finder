import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
    fetchUserPortfolios,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
} from "../../../services/portfolioFetch";
import { Portfolio } from "../../../types/portfolio";
import PortfolioCard from "../../../components/MyPortfoliosPage/PortfolioCard";
import ModalPortfolio, {
    PortfolioForm,
} from "../../../components/MyPortfoliosPage/Modals/ModalPortfolio";
import { toast } from "react-toastify";

const MyServicesPage: React.FC = () => {
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "delete" | "edit">(
        "create"
    );
    const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(
        null
    );
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            console.error("No token found");
            return;
        }

        const decodedToken = jwtDecode<{ userId: string }>(token);
        const userId = decodedToken?.userId;

        if (!userId) {
            console.error("User ID not found in token");
            return;
        }

        const loadPortfolios = async () => {
            try {
                const data = await fetchUserPortfolios(userId, token);
                setPortfolios(data);
            } catch (error) {
                console.error("Error fetching portfolios:", error);
                toast.error("Error al obtener los portafolios.");
            }
        };

        loadPortfolios();
    }, [token]);

    const handleCreatePortfolio = async (newPortfolio: PortfolioForm) => {
        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            console.log("Datos enviados:", newPortfolio);
            const createdPortfolio = await createPortfolio(token, newPortfolio);
            setPortfolios((prevPortfolios) => [
                ...prevPortfolios,
                createdPortfolio,
            ]);
            setIsModalOpen(false);
            toast.success("Portafolio creado exitosamente.");
        } catch (error) {
            console.error("Error creating portfolio:", error);
            toast.error("Error al crear el portafolio.");
        }
    };

    const handleEditPortfolio = async (updatedPortfolio: PortfolioForm) => {
        if (!editingPortfolio || !token) return;

        try {
            const updated = await updatePortfolio(
                token,
                editingPortfolio._id,
                updatedPortfolio
            );
            setPortfolios((prevPortfolios) =>
                prevPortfolios.map((portfolio) =>
                    portfolio._id === editingPortfolio._id ? updated : portfolio
                )
            );
            setIsModalOpen(false);
            setEditingPortfolio(null);
            toast.success("Portafolio actualizado exitosamente.");
        } catch (error) {
            console.error("Error updating portfolio:", error);
            toast.error("Error al actualizar el portafolio.");
        }
    };

    const handleDeletePortfolio = async () => {
        if (!editingPortfolio || !token) return;

        try {
            const success = await deletePortfolio(token, editingPortfolio._id);
            if (!success) {
                throw new Error("Error deleting portfolio");
            }
            setPortfolios((prevPortfolios) =>
                prevPortfolios.filter(
                    (portfolio) => portfolio._id !== editingPortfolio._id
                )
            );
            setIsModalOpen(false);
            setEditingPortfolio(null);
            toast.success("Portafolio borrado exitosamente.");
        } catch (error) {
            console.error("Error deleting portfolio:", error);
            toast.error("Error al borrar el portafolio.");
        }
    };

    const openEditModal = (portfolio: Portfolio) => {
        setEditingPortfolio(portfolio);
        setModalMode("edit");
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setEditingPortfolio(null);
        setModalMode("create");
        setIsModalOpen(true);
    };

    const openDeleteModal = (portfolio: Portfolio) => {
        setEditingPortfolio(portfolio);
        setModalMode("delete");
        setIsModalOpen(true);
    };

    const handleSubmit = (data: PortfolioForm) => {
        if (modalMode === "create") {
            handleCreatePortfolio(data);
        } else if (modalMode === "edit") {
            handleEditPortfolio(data);
        } else if (modalMode === "delete") {
            handleDeletePortfolio();
        }
    };

    return (
        <div className="overflow-hidden sm:rounded-lg transition-colors duration-300 ease-in-out">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Mis Portfolios
                    </h1>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-300">
                        Aquí puedes ver y administrar tus portafolios y
                        agregarle Servicios a cada uno.
                    </p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                    Crear nuevo portafolio
                </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolios.map((portfolio) => (
                    <PortfolioCard
                        key={portfolio._id}
                        portfolio={portfolio}
                        onServiceClick={() => openCreateModal()}
                        onEditClick={() => openEditModal(portfolio)}
                        onDeleteClick={() => openDeleteModal(portfolio)}
                        isEditable={true}
                    />
                ))}
            </div>
            <ModalPortfolio
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingPortfolio(null);
                }}
                mode={modalMode}
                onSubmit={handleSubmit}
                initialData={
                    editingPortfolio
                        ? {
                              title: editingPortfolio.title,
                              description: editingPortfolio.description,
                              duration: editingPortfolio.duration,
                              category: editingPortfolio.category,
                          }
                        : undefined
                }
            />
        </div>
    );
};

export default MyServicesPage;
