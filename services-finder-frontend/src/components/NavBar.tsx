import React, { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";  
import {
    Home,
    User as UserIcon,
    LogOut,
    PlusCircle,
    FilePlus as NewPostIcon,
    BadgeDollarSignIcon,
} from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../Context/AuthContext";
import { User } from "../types/users";
import Modal from "../components/Modals/Modal";
import ModalPost from "../components/Modals/ModalPost";
import ConfirmLogoutModal from "./utils/ConfirmLogoutModal";
import ModalOffer from "./MyOfferPage/ModalOffer";
import { createOffer } from "../services/offersFetch";
import { OfferData } from "../types/offer";
import Tooltip from "./Tooltip";

const Navbar: React.FC = () => {
    const location = useLocation();
    const [isOptionsOpen, setIsOptionsOpen] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isModalOfferOpen, setIsModalOfferOpen] = useState<boolean>(false);
    const [isPostModalOpen, setIsPostModalOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { user, logout }: { user: User | null; logout: () => void } =
        useAuth();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const toggleOptions = () => {
        setIsOptionsOpen((prev) => !prev);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("authToken");
        logout();
        setIsLogoutModalOpen(false);
        navigate("/");
    };

    const handlePostSubmit = () => {
        //api.createPost(data);
    };

    const handleCreateOffer = async (offerData: OfferData) => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                const createdOffer = await createOffer(token, offerData);
                console.log("Oferta creada:", createdOffer);
                setIsModalOpen(false);
            } else {
                console.error("Token is null");
            }
            setIsModalOpen(false);
            // Aquí puedes actualizar la lista de ofertas o mostrar un mensaje de éxito.
        } catch (error) {
            console.error("Error al crear la oferta:", error);
        }
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const openNewPostModal = () => setIsPostModalOpen(true);
    const closeNewPostModal = () => setIsPostModalOpen(false);

    const closeLogoutModal = () => setIsLogoutModalOpen(false);
    const openLogoutModal = () => setIsLogoutModalOpen(true);

    const openModalOffer = () => setIsModalOfferOpen(true);
    const closeModalOffer = () => setIsModalOfferOpen(false);
    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 w-full">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 w-full">
                    <div className="hidden md:flex items-center space-x-8 w-full">
                        <div className="flex items-center space-x-8 w-1/3">
                            <div className="flex-shrink-0">
                                <Tooltip text="Home">
                                    <Home
                                        className="h-6 w-6 text-indigo-600 dark:text-indigo-400 cursor-pointer"
                                        onClick={() => navigate("/")}
                                    />
                                </Tooltip>
                            </div>
                            {[
                                "/services",
                                "/category",
                                "/about",
                                "/contact",
                            ].map((path, index) => {
                                const labels = [
                                    "Services",
                                    "Category",
                                    "About",
                                    "Contact",
                                ];
                                const isActive = location.pathname === path;

                                return (
                                    <Link
                                        key={index}
                                        to={path}
                                        className={`inline-flex items-center px-1 pt-1 text-[16px] font-medium ${
                                            isActive
                                                ? "text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400"
                                                : "text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                        } transition-all duration-300 ease-in-out`}>
                                        {labels[index]}
                                    </Link>
                                );
                            })}
                        </div>
                        <div className="relative w-full max-w-2xl mx-auto">
                            {/* You can add a search bar or other elements here */}
                        </div>
                        <div className="flex items-center space-x-4 w-1/3 justify-end relative">
                            {user && (
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    {user.userType}
                                </span>
                            )}
                            <div className="relative" ref={dropdownRef}>
                                {user ? (
                                    <div className="flex items-center space-x-4">
                                        {user.userType === "Cliente" && (
                                            <Tooltip text="Create Offer">
                                                <button 
                                                    className="bg-gray-700 hover:bg-green-700 transition-all rounded-lg text-white flex items-center justify-center p-2"
                                                    onClick={openModalOffer}
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <BadgeDollarSignIcon
                                                            className="h-6 w-6 text-gray-400 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300 ease-in-out cursor-pointer"
                                                        />
                                                        <span>Create Offer</span>
                                                    </div>
                                                </button>
                                            </Tooltip>
                                        )}
                                        {user.userType === "Proveedor" && (
                                            <>
                                                <Tooltip text="Add Service">
                                                    <PlusCircle
                                                        className="h-6 w-6 text-gray-400 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 ease-in-out cursor-pointer"
                                                        onClick={openModal}
                                                    />
                                                </Tooltip>
                                                <Tooltip text="New Post">
                                                    <NewPostIcon
                                                        className="h-6 w-6 text-gray-400 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300 ease-in-out cursor-pointer"
                                                        onClick={openNewPostModal}
                                                    />
                                                </Tooltip>
                                            </>
                                        )}
                                        <div
                                            className="relative"
                                            ref={optionsRef}>
                                            <Tooltip text="Provider Options">
                                                <button
                                                    onClick={toggleOptions}
                                                    className="text-gray-400 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 ease-in-out cursor-pointer mt-1">
                                                    <UserIcon />
                                                </button>
                                            </Tooltip>
                                            <AnimatePresence>
                                                {isOptionsOpen && (
                                                    <motion.div
                                                        initial={{
                                                            opacity: 0,
                                                            y: -10,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                        }}
                                                        exit={{
                                                            opacity: 0,
                                                            y: -10,
                                                        }}
                                                        transition={{
                                                            duration: 0.3,
                                                            ease: "easeOut",
                                                        }}
                                                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
                                                        {user.userType ===
                                                        "Proveedor" ? (
                                                            <>
                                                                <Link
                                                                    to="/my-services"
                                                                    className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 ease-in-out">
                                                                    Services
                                                                </Link>
                                                                <Link
                                                                    to="/my-posts"
                                                                    className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 ease-in-out">
                                                                    Posts
                                                                </Link>
                                                                <Link
                                                                    to="/profile"
                                                                    className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 ease-in-out">
                                                                    Profile
                                                                </Link>
                                                                <Link
                                                                    to="/chats"
                                                                    className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 ease-in-out">
                                                                    Chats
                                                                </Link>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Link
                                                                    to="/offers"
                                                                    className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 ease-in-out">
                                                                    Offers
                                                                </Link>
                                                                <Link
                                                                    to="/profile"
                                                                    className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 ease-in-out">
                                                                    Profile
                                                                </Link>
                                                                <Link
                                                                    to="/chats"
                                                                    className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 ease-in-out">
                                                                    Chats
                                                                </Link>
                                                            </>
                                                        )}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        <Tooltip text="Logout">
                                            <LogOut
                                                className="h-6 w-6 text-gray-400 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
                                                onClick={openLogoutModal}
                                            />
                                        </Tooltip>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center space-x-4">
                                            <Tooltip text="Login">
                                                <Link
                                                    to="/login"
                                                    className="block px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 ease-in-out">
                                                    Login
                                                </Link>
                                            </Tooltip>
                                            <Tooltip text="Register">
                                                <Link
                                                    to="/register"
                                                    className="block px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 ease-in-out">
                                                    Register
                                                </Link>
                                            </Tooltip>
                                        </div>
                                    </>
                                )}
                            </div>
                            <DarkModeToggle />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handlePostSubmit}
            />

            <ModalPost
                isOpen={isPostModalOpen}
                onClose={closeNewPostModal}
                onSubmit={handlePostSubmit}
                // portfolioId={""}
            />

            <ConfirmLogoutModal
                isOpen={isLogoutModalOpen}
                onClose={closeLogoutModal}
                onConfirm={handleLogout}
            />

            <ModalOffer
                isOpen={isModalOfferOpen}
                onClose={closeModalOffer}
                onConfirm={handleCreateOffer}
            />
        </nav>
    );
};

export default Navbar;