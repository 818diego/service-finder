import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, User as UserIcon, LogOut, Menu, X } from "lucide-react";
import { LogIn, UserPlus } from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../Context/AuthContext";
import { useSocket } from "../Context/SocketContext";
import { User } from "../types/users";
import ConfirmLogoutModal from "./utils/ConfirmLogoutModal";
import Tooltip from "./Tooltip";
import NotificationDropdown from "./NotificationDropdown";

const Navbar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOptionsOpen, setIsOptionsOpen] = useState<boolean>(false);
    const [isNotificationsOpen, setIsNotificationsOpen] =
        useState<boolean>(false);
    const [notificationCount, setNotificationCount] = useState<number>(0);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);
    const { user, logout }: { user: User | null; logout: () => void } =
        useAuth();
    const { socket } = useSocket();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

    useEffect(() => {
        if (socket) {
            socket.on("notification", (data: Notification) => {
                setNotifications((prevNotifications) => [
                    data,
                    ...prevNotifications,
                ]);
                setNotificationCount((prevCount) => prevCount + 1);
            });
        }

        return () => {
            if (socket) {
                socket.off("notification");
            }
        };
    }, [socket]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOptionsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleOptions = () => {
        setIsOptionsOpen((prev) => !prev);
    };

    const toggleNotifications = () => {
        setIsNotificationsOpen((prev) => !prev);
        setNotificationCount(0);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("authToken");
        logout();
        setIsLogoutModalOpen(false);
        navigate("/");
    };

    const closeLogoutModal = () => setIsLogoutModalOpen(false);
    const openLogoutModal = () => setIsLogoutModalOpen(true);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => !prev);
    };

    const navigationLinks = () => {
        const baseLinks = [
            { path: "/category", label: "Category" },
            { path: "/about", label: "About" },
            { path: "/contact", label: "Contact" },
        ];

        if (user?.userType === "Proveedor") {
            return [
                { path: "/my-portfolios", label: "Portfolios" },
                ...baseLinks,
            ];
        } else {
            return baseLinks;
        }
    };

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 w-full">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 w-full">
                    <div className="flex items-center space-x-8">
                        <Tooltip text="Home">
                            <Home
                                className="h-6 w-6 text-indigo-600 dark:text-indigo-400 cursor-pointer"
                                onClick={() => navigate("/")}
                            />
                        </Tooltip>
                        <div className="hidden md:flex space-x-8">
                            {navigationLinks().map((link, index) => {
                                const isActive = location.pathname === link.path;
                                return (
                                    <Link
                                        key={index}
                                        to={link.path}
                                        className={`inline-flex items-center px-1 pt-1 text-[16px] font-medium ${
                                            isActive
                                                ? "text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400"
                                                : "text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                        } transition-all duration-300 ease-in-out`}>
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 ml-auto relative">
                        <button
                            className="md:hidden text-gray-400 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 ease-in-out"
                            onClick={toggleMobileMenu}>
                            {isMobileMenuOpen ? <X /> : <Menu />}
                        </button>
                        <div className="hidden md:flex items-center space-x-4">
                            {user && (
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    {user.userType}
                                </span>
                            )}
                            {/* Icono de notificaciones */}
                            {user &&
                                (user.userType === "Cliente" ||
                                    user.userType === "Proveedor") && (
                                    <NotificationDropdown
                                        isOpen={isNotificationsOpen}
                                        notifications={notifications}
                                        notificationCount={notificationCount}
                                        toggleNotifications={toggleNotifications}
                                    />
                                )}
                            <div className="relative" ref={dropdownRef}>
                                {user ? (
                                    <div className="flex items-center space-x-4">
                                        <div ref={optionsRef}>
                                            <Tooltip text="User Options">
                                                <button
                                                    onClick={toggleOptions}
                                                    className="text-gray-400 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 ease-in-out cursor-pointer">
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
                                    <div className="flex items-center space-x-4">
                                        <Tooltip text="Login">
                                            <Link
                                                to="/login"
                                                className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 ease-in-out flex items-center space-x-2">
                                                <LogIn className="w-4 h-4" />
                                                <span>Login</span>
                                            </Link>
                                        </Tooltip>
                                        <Tooltip text="Register">
                                            <Link
                                                to="/register"
                                                className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 ease-in-out flex items-center space-x-2">
                                                <UserPlus className="w-4 h-4" />
                                                <span>Register</span>
                                            </Link>
                                        </Tooltip>
                                    </div>
                                )}
                            </div>
                            <DarkModeToggle />
                        </div>
                    </div>
                </div>
                <div
                    className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navigationLinks().map((link, index) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={index}
                                    to={link.path}
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                                        isActive
                                            ? "text-indigo-600 dark:text-indigo-400"
                                            : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                    } transition-all duration-300 ease-in-out`}>
                                    {link.label}
                                </Link>
                            );
                        })}
                        {user && (
                            <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300">
                                {user.userType}
                            </span>
                        )}
                        {user && (
                            <>
                                {user.userType === "Proveedor" ? (
                                    <>
                                        <Link
                                            to="/profile"
                                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 ease-in-out">
                                            Profile
                                        </Link>
                                        <Link
                                            to="/chats"
                                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 ease-in-out">
                                            Chats
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/offers"
                                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 ease-in-out">
                                            Offers
                                        </Link>
                                        <Link
                                            to="/profile"
                                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 ease-in-out">
                                            Profile
                                        </Link>
                                        <Link
                                            to="/chats"
                                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 ease-in-out">
                                            Chats
                                        </Link>
                                    </>
                                )}
                                <button
                                    onClick={openLogoutModal}
                                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 ease-in-out">
                                    Logout
                                </button>
                            </>
                        )}
                        {!user && (
                            <>
                                <Link
                                    to="/login"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 ease-in-out">
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 ease-in-out">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmLogoutModal
                isOpen={isLogoutModalOpen}
                onClose={closeLogoutModal}
                onConfirm={handleLogout}
            />
        </nav>
    );
};

export default Navbar;
