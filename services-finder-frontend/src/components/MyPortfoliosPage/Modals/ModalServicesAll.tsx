// components/Modals/ModalServicesAll.tsx

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
    fetchServices,
    updateService,
    deleteService,
} from "../../../services/serviceFetch";
import { Service, ServiceForm } from "../../../types/service";
import ServiceCard from "../ServiceCard";
import ModalService from "../Modals/ModalService";
import { toast } from "react-toastify";

interface ModalServicesAllProps {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
    providerUsername: string;
    portfolioId: string;
}

const ModalServicesAll: React.FC<ModalServicesAllProps> = ({
    isOpen,
    onClose,
    providerUsername,
    portfolioId,
}) => {
    const [services, setServices] = useState<Service[]>([]);
    const [isModalServiceOpen, setIsModalServiceOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"edit" | "delete">("edit");
    const [selectedService, setSelectedService] = useState<Service | null>(
        null
    );
    const token = localStorage.getItem("authToken") || "";

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

    const handleCloseModalService = () => {
        console.log("Closing Modal Service");
        setIsModalServiceOpen(false);
        setSelectedService(null);
    };

    const handleSubmit = async (formData: FormData | null) => {
        console.log("Form Submitted:", formData);
        if (modalMode === "edit" && selectedService && formData) {
            try {
                // Prepara los datos para la actualización
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

                // Envía la actualización y recibe el servicio actualizado
                const updatedService = await updateService(
                    selectedService._id,
                    updateData,
                    token
                );

                console.log("Updated Service:", updatedService);

                // Actualiza el estado con el servicio editado
                setServices((prevServices) =>
                    prevServices.map((service) =>
                        service._id === updatedService._id
                            ? updatedService
                            : service
                    )
                );

                // Cierra el modal de edición
                handleCloseModalService();
                toast.success("Servicio actualizado exitosamente.");
            } catch (error) {
                console.error("Failed to update service:", error);
                toast.error("Error al actualizar el servicio.");
            }
        } else if (modalMode === "delete" && selectedService) {
            try {
                console.log("Deleting Service ID:", selectedService._id);
                await deleteService(selectedService._id, token);
                console.log("Service deleted:", selectedService._id);

                // Actualiza el estado eliminando el servicio
                setServices((prevServices) =>
                    prevServices.filter(
                        (service) => service._id !== selectedService._id
                    )
                );

                // Cierra el modal de eliminación
                handleCloseModalService();
                toast.success("Servicio eliminado exitosamente.");
            } catch (error) {
                console.error("Failed to delete service:", error);
                toast.error("Error al eliminar el servicio.");
            }
        } else {
            console.log("No action taken.");
        }
    };

    return (
        <>
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
                            {services.length > 0 ? (
                                services.map((service, index) => (
                                    <ServiceCard
                                        key={
                                            service._id
                                                ? service._id
                                                : `service-${index}`
                                        }
                                        service={service}
                                        onEdit={() => handleEdit(service)}
                                        onDelete={() => handleDelete(service)}
                                    />
                                ))
                            ) : (
                                <p>No hay servicios disponibles</p>
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
        </>
    );
};

export default ModalServicesAll;
