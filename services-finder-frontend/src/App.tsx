// App.tsx
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./RoutesConfig";
import Navbar from "./components/NavBar";

const App: React.FC = () => {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300 ease-in-out">
                <Navbar />
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <AppRoutes />
                </div>
            </div>
        </Router>
    );
};

export default App;
