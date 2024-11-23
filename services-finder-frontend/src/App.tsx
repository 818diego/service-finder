// src/App.tsx
import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    useLocation,
} from "react-router-dom";
import { AppRoutes } from "./RoutesConfig";
import Navbar from "./components/NavBar";
import { SocketProvider } from "./Context/SocketContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AppContent: React.FC = () => {
    const location = useLocation();
    const isChatPage = location.pathname === "/chats";
    const isHomePage = location.pathname === "/";
    const isCategoryPage = location.pathname === "/category";

    return (
        <div
            className={`min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300 ease-in-out`}>
            <ToastContainer />
            <Navbar />
            <div
                className={
                    isChatPage
                        ? "max-w-8xl h-full mx-auto py-6 sm:px-6 lg:px-8"
                        : isHomePage
                        ? "max-w-8xl mx-auto py-6 sm:px-6 lg:px-8"
                        : isCategoryPage
                        ? "max-w-8xl mx-auto py-6 sm:px-6 lg:px-8"
                        : "max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"
                }>
                <AppRoutes />
            </div>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <Router>
            <SocketProvider>
                <Routes>
                    <Route path="*" element={<AppContent />} />
                </Routes>
            </SocketProvider>
        </Router>
    );
};

export default App;
