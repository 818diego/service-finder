import { Routes, Route } from "react-router-dom";

// Import pages principal
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ServicesPage from "./pages/ServicesPage";
import CategoryPage from "./pages/CategoryPage";

// Import pages auth
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Import pages accounts
import ProfilePage from "./pages/accounts/proveedor/ProfilePage";
import MyPortfoliosPage from "./pages/accounts/proveedor/MyPortfoliosPage";
import MyChatsPage from "./pages/accounts/proveedor/MyChatsPage";

// Import pages cliente
import MyOffersPage from "./pages/accounts/cliente/MyOffersPage";

export const AppRoutes: React.FC = () => (
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/category" element={<CategoryPage />} />
        {/* Authentication Routing here */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Options for a Provider */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/my-portfolios" element={<MyPortfoliosPage />} />
        <Route path="/chats" element={<MyChatsPage />} />

        {/* Options for a Cliente */}
        <Route path="/offers" element={<MyOffersPage />} />
    </Routes>
);
