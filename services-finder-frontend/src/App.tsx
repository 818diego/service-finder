import { BrowserRouter as Router, Link } from "react-router-dom";
import { Home, Settings, User } from "lucide-react";
import { AppRoutes } from "./RoutesConfig";

const App: React.FC = () => {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                <nav className="bg-white shadow-md">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex">
                                <div className="flex-shrink-0 flex items-center">
                                    <Home className="h-8 w-8 text-indigo-600" />
                                </div>
                                <div className="ml-6 flex space-x-8">
                                    <Link
                                        to="/"
                                        className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900">
                                        Home
                                    </Link>
                                    <Link
                                        to="/about"
                                        className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                                        About
                                    </Link>
                                    <Link
                                        to="/contact"
                                        className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                                        Contact
                                    </Link>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <User className="h-6 w-6 text-gray-400 mr-4" />
                                <Settings className="h-6 w-6 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <AppRoutes />
                </div>
            </div>
        </Router>
    );
};

export default App;
