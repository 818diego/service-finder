import React, { useEffect, useState } from "react";
import { PlusCircle, X } from "lucide-react";
import {
    fetchServices,
    updateService,
    deleteService,
    createService,
} from "../../../services/serviceFetch";
import { Service, ServiceForm } from "../../../types/service";
import ServiceCard from "../ServiceCard";
import ModalService from "../Modals/ModalService";
import { toast } from "react-toastify";
import ProposalModal from "../../ClientComponents/ProposalModal";
import { createChat } from "../../../services/chatsFetch";

interface ModalServicesAllProps {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
    providerUsername: string;
    portfolioId: string;
    userType: "Cliente" | "Proveedor" | null;
}

const ModalServicesAll: React.FC<ModalServicesAllProps> = ({
    isOpen,
    onClose,
    providerUsername,
    portfolioId,
    userType,
}) => {
    const [services, setServices] = useState<Service[]>([]);
    const [isModalServiceOpen, setIsModalServiceOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"edit" | "delete" | "create">(
        "edit"
    );
    const [selectedService, setSelectedService] = useState<Service | null>(
        null
    );
    const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
    const [selectedServiceForProposal, setSelectedServiceForProposal] =
        useState<Service | null>(null);
    const token = localStorage.getItem("authToken") || "";
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const loadServices = async () => {
                try {
                    const fetchedServices = await fetchServices(
                        portfolioId,
                        token
                    );
                    console.log("Fetched Services:", fetchedServices);
                    setServices(fetchedServices);
                } catch (error) {
                    console.error("Error fetching services:", error);
                    toast.error("Error al cargar los servicios.");
                }
            };
            loadServices();
        }
    }, [isOpen, portfolioId, token]);

    const handleEdit = (service: Service) => {
        console.log("Editing Service:", service);
        setSelectedService(service);
        setModalMode("edit");
        setIsModalServiceOpen(true);
    };

    const handleDelete = (service: Service) => {
        console.log("Deleting Service:", service);
        setSelectedService(service);
        setModalMode("delete");
        setIsModalServiceOpen(true);
    };

    const handleCreate = () => {
        setSelectedService(null);
        setModalMode("create");
        setIsModalServiceOpen(true);
    };

    const handleCloseModalService = () => {
        console.log("Closing Modal Service");
        setIsModalServiceOpen(false);
        setSelectedService(null);
    };

    const handleSubmit = async (formData: FormData | null) => {
        console.log("Form Submitted:", formData);
        setIsLoading(true);
        if (modalMode === "edit" && selectedService && formData) {
            try {
                const updateData: ServiceForm = {
                    title: formData.get("title") as string,
                    description: formData.get("description") as string,
                    portfolio: portfolioId,
                    price: parseFloat(formData.get("price") as string),
                    category: formData.get("category") as string,
                    images: formData.getAll("images") as File[],
                    removeImageUrls: formData.has("removeImageUrls")
                        ? JSON.parse(formData.get("removeImageUrls") as string)
                        : undefined,
                };

                console.log("Update Data:", updateData);

                const updatedService = await updateService(
                    selectedService._id,
                    updateData,
                    token
                );

                console.log("Updated Service:", updatedService);

                setServices((prevServices) =>
                    prevServices.map((service) =>
                        service._id === updatedService._id
                            ? updatedService
                            : service
                    )
                );

                handleCloseModalService();
                toast.success("Servicio actualizado exitosamente.");
            } catch (error) {
                console.error("Failed to update service:", error);
                toast.error("Error al actualizar el servicio.");
            } finally {
                setIsLoading(false);
            }
        } else if (modalMode === "delete" && selectedService) {
            try {
                console.log("Deleting Service ID:", selectedService._id);
                await deleteService(selectedService._id, token);
                console.log("Service deleted:", selectedService._id);

                setServices((prevServices) =>
                    prevServices.filter(
                        (service) => service._id !== selectedService._id
                    )
                );

                handleCloseModalService();
                toast.success("Servicio eliminado exitosamente.");
            } catch (error) {
                console.error("Failed to delete service:", error);
                toast.error("Error al eliminar el servicio.");
            } finally {
                setIsLoading(false);
            }
        } else if (modalMode === "create" && formData) {
            try {
                setIsLoading(true); // Start loading
                const createData: ServiceForm = {
                    title: formData.get("title") as string,
                    description: formData.get("description") as string,
                    portfolio: portfolioId,
                    price: parseFloat(formData.get("price") as string),
                    category: formData.get("category") as string,
                    images: formData.getAll("images") as File[],
                };

                console.log("Create Data:", createData);

                const newService = await createService(createData, token);

                console.log("New Service:", newService);

                setServices((prevServices) => [...prevServices, newService]);

                handleCloseModalService();
                toast.success("Servicio creado exitosamente.");
            } catch (error) {
                console.error("Failed to create service:", error);
                toast.error("Error al crear el servicio.");
            } finally {
                setIsLoading(false); // End loading
            }
        } else {
            console.log("No action taken.");
            setIsLoading(false);
        }
    };

    const handleProposal = async (
        service: Service,
        initialMessage?: string
    ) => {
        if (initialMessage) {
            if (!service) {
                console.error("No service selected for proposal.");
                toast.error("Servicio no seleccionado.");
                return;
            }

            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found");
                toast.error("No se encontró el token de autenticación.");
                return;
            }

            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                if (payload.userType !== "Cliente") {
                    console.error("Unauthorized: User is not a Cliente");
                    toast.error(
                        "Usuario no autorizado para enviar propuestas."
                    );
                    return;
                }

                const response = await createChat(
                    service._id,
                    service._id,
                    initialMessage,
                    token
                );

                console.log("Chat creado:", response);
                toast.success("Propuesta enviada exitosamente.");
            } catch (error) {
                console.error(
                    "Error al decodificar el token o crear el chat:",
                    error
                );
                toast.error("Error al enviar la propuesta.");
            } finally {
                handleCloseProposalModal();
            }

            return;
        }
        setSelectedServiceForProposal(service);
        setIsProposalModalOpen(true);
    };

    const handleCloseProposalModal = () => {
        setIsProposalModalOpen(false);
        setSelectedServiceForProposal(null);
    };

    function openCreateModal(
        event:
            | React.MouseEvent<HTMLDivElement, MouseEvent>
            | React.KeyboardEvent<HTMLDivElement>
    ): void {
        if ("key" in event && event.key !== "Enter") return;
        handleCreate();
    }

    return (
        <>
            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="loader"></div>
                </div>
            )}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-fade-in">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-[1600px] max-h-[900px] h-full sm:h-auto mx-4 relative overflow-y-auto modal-scale-in">
                        <button
                            onClick={onClose}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
                            aria-label="Close Modal">
                            <X size={24} />
                        </button>

                        <h2 className="text-xl font-bold">
                            Servicios de {providerUsername}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                            Explora los proyectos y servicios ofrecidos por{" "}
                            {providerUsername}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                            {services.map((service, index) => (
                                <ServiceCard
                                    key={
                                        service._id
                                            ? service._id
                                            : `service-${index}`
                                    }
                                    service={service}
                                    onEdit={() => handleEdit(service)}
                                    onDelete={() => handleDelete(service)}
                                    isEditable={userType === "Proveedor"}
                                    onSendProposalClick={() =>
                                        handleProposal(service)
                                    }
                                />
                            ))}
                            {userType === "Proveedor" && (
                                <div
                                    onClick={openCreateModal}
                                    className="flex flex-col justify-center items-center border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 transition duration-300 ease-in-out shadow-sm hover:shadow-lg"
                                    style={{ height: "500px" }}
                                    role="button"
                                    aria-label="Añadir nuevo servicio"
                                    tabIndex={0}
                                    onKeyDown={(e) =>
                                        e.key === "Enter" && openCreateModal(e)
                                    }>
                                    <PlusCircle className="h-16 w-16 text-gray-700 transition duration-300 hover:text-blue-500" />
                                    <p className="text-lg text-gray-500 font-semibold mt-4">
                                        Añadir Servicio
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        Haz clic para agregar un nuevo servicio
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <ModalService
                isOpen={isModalServiceOpen}
                onClose={handleCloseModalService}
                mode={modalMode}
                onSubmit={handleSubmit}
                portfolioId={portfolioId}
                initialData={
                    modalMode === "edit" && selectedService
                        ? {
                              title: selectedService.title,
                              description: selectedService.description,
                              price: selectedService.price,
                              images: selectedService.images || [],
                          }
                        : undefined
                }
                className="modal-fade-in modal-scale-in"
            />
            {isProposalModalOpen && selectedServiceForProposal && (
                <ProposalModal
                    isOpen={isProposalModalOpen}
                    onClose={handleCloseProposalModal}
                    onSubmit={(initialMessage) =>
                        handleProposal(
                            selectedServiceForProposal,
                            initialMessage
                        )
                    }
                    jobOfferId={selectedServiceForProposal._id}
                />
            )}
        </>
    );
};

export default ModalServicesAll;
