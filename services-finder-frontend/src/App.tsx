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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SocketProvider } from "./Context/SocketContext";

const AppContent: React.FC = () => {
    const location = useLocation();
    const isChatPage = location.pathname.startsWith("/chats");
    const isHomePage = location.pathname === "/";

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
