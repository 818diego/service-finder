import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Home,
    User as UserIcon,
    Search,
    LogOut,
    Settings,
    PlusCircle,
} from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../Context/AuthContext";

const Navbar: React.FC = () => {
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
        ) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        const confirmed = window.confirm("Are you sure you want to log out?");
        if (confirmed) {
            logout();
            navigate("/login");
        }
    };

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 w-full">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 w-full">
                    <div className="hidden md:flex items-center space-x-8 w-full">
                        <div className="flex items-center space-x-8 w-1/3">
                            <div className="flex-shrink-0">
                                <Home
                                    className="h-6 w-6 text-indigo-600 dark:text-indigo-400 cursor-pointer"
                                    onClick={() => navigate("/")}
                                />
                            </div>
                            {[
                                "/",
                                "/services",
                                "/category",
                                "/about",
                                "/contact",
                            ].map((path, index) => {
                                const labels = [
                                    "Home",
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
                                        className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                                            isActive
                                                ? "text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400"
                                                : "text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                        } transition-all duration-300 ease-in-out`}>
                                        {labels[index]}
                                    </Link>
                                );
                            })}
                        </div>
                        <div className="relative w-1/3 mx-auto">
                            <Search className="absolute right-3 top-2 h-5 w-5 text-gray-500 dark:text-gray-300" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search..."
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div className="flex items-center space-x-4 w-1/3 justify-end relative">
                            <div className="relative" ref={dropdownRef}>
                                {user ? (
                                    <div className="flex items-center space-x-4">
                                        <PlusCircle
                                            className="h-6 w-6 text-gray-400 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 ease-in-out cursor-pointer"
                                            onClick={() => navigate("/post")}
                                        />
                                        <Settings
                                            className="h-6 w-6 text-gray-400 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 ease-in-out cursor-pointer"
                                            onClick={() => navigate("/profile")}
                                        />
                                        <LogOut
                                            className="h-6 w-6 text-gray-400 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-300 ease-in-out cursor-pointer"
                                            onClick={handleLogout}
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <UserIcon
                                            className="h-6 w-6 text-gray-400 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 ease-in-out cursor-pointer"
                                            onClick={toggleDropdown}
                                        />
                                        <AnimatePresence>
                                            {isDropdownOpen && (
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
                                                    <Link
                                                        to="/login"
                                                        className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 ease-in-out">
                                                        Login
                                                    </Link>
                                                    <Link
                                                        to="/register"
                                                        className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 ease-in-out">
                                                        Register
                                                    </Link>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </>
                                )}
                            </div>
                            <DarkModeToggle />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
