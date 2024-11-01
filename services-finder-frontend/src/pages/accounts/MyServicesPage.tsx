import React, { useEffect, useState } from "react";
import MyServicesCard from "../../components/MyServicesPage/MyServiceCard";
import {
    fetchUserServices,
    updateService,
    deleteService,
} from "../../services/serviceFetch";
import { toast } from "react-toastify";
import ModalService from "../../components/MyServicesPage/ModalService";
import { Service, CreateServiceData } from "../../types/service";
import { PostFormInput } from "../../types/post";
import { createPost } from "../../services/postFetch";

const MyServicesPage: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit" | "delete">(
        "create"
    );
    const [selectedService, setSelectedService] = useState<Service | null>(
        null
    );

    const loadServices = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("No token found");
            return;
        }
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const userId = payload.userId;
            const servicesData = await fetchUserServices(userId, token);
            setServices(servicesData);
            console.log("Loaded services:", servicesData);
        } catch (error) {
            console.error("Error loading services:", error);
            toast.error("Error loading services");
        }
    };

    const handleCreateService = (serviceId: string) => {
        const service = services.find((s) => s._id === serviceId) || null;
        setSelectedService(service);
        setModalMode("create");
        setIsModalOpen(true);
    };

    const handleEditService = (serviceId: string) => {
        const service = services.find((s) => s._id === serviceId) || null;
        setSelectedService(service);
        setModalMode("edit");
        setIsModalOpen(true);
    };

    const handleDeleteService = (serviceId: string) => {
        const service = services.find((s) => s._id === serviceId) || null;
        setSelectedService(service);
        setModalMode("delete");
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (data: CreateServiceData | Service) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            if (modalMode === "create") {
                if (selectedService) {
                    const portfolioId = selectedService.portfolio;
                    console.log("Selected service:", selectedService);
                    console.log("Portfolio ID:", portfolioId);
                    const postResponse = await createPost(
                        portfolioId,
                        data as unknown as PostFormInput
                    );
                    console.log("Post created successfully:", postResponse);
                    toast.success("Post created successfully");
                } else {
                    console.log("No service selected for creating post");
                }
            } else if (modalMode === "edit" && selectedService) {
                const updatedService = await updateService(
                    selectedService._id,
                    data as CreateServiceData
                );
                toast.success("Service updated successfully");
                setServices((prevServices) =>
                    prevServices.map((service) =>
                        service._id === updatedService._id
                            ? updatedService
                            : service
                    )
                );
            } else if (modalMode === "delete" && selectedService) {
                await deleteService(selectedService._id);
                toast.success("Service deleted successfully");
                setServices((prevServices) =>
                    prevServices.filter(
                        (service) => service._id !== selectedService._id
                    )
                );
            }
        } catch (error) {
            console.error("Error handling service:", error);
            toast.error(`Error ${modalMode} service`);
        } finally {
            setIsModalOpen(false);
            setSelectedService(null);
        }
    };

    useEffect(() => {
        loadServices();
    }, []);

    return (
        <div className="overflow-hidden sm:rounded-lg transition-colors duration-300 ease-in-out">
            <div className="px-4 py-5 sm:px-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Welcome to My Services
                </h1>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-300">
                    These are the services you provide.
                </p>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => (
                    <MyServicesCard
                        key={service._id}
                        providerName={service.provider.username}
                        title={service.title}
                        description={service.description}
                        price={service.price}
                        duration={service.duration}
                        category={service.category}
                        onCreatePostClick={() =>
                            handleCreateService(service._id)
                        }
                        onDeleteServiceClick={() =>
                            handleDeleteService(service._id)
                        }
                        onEditServiceClick={() =>
                            handleEditService(service._id)
                        }
                    />
                ))}
            </div>
            <ModalService
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mode={modalMode}
                onSubmit={handleModalSubmit}
                initialData={
                    modalMode === "edit" && selectedService
                        ? {
                              title: selectedService.title,
                              description: selectedService.description,
                              price: selectedService.price,
                              duration: selectedService.duration,
                              category: selectedService.category,
                          }
                        : undefined
                }
                serviceId={selectedService ? selectedService._id : undefined}
            />
        </div>
    );
};

export default MyServicesPage;
