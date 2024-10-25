import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ServicesPage from "./pages/ServicesPage"
import CategoryPage from "./pages/CategoryPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProfilePage from "./pages/accounts/ProfilePage";
import PostsPage from "./pages/PostsPage";

export const AppRoutes: React.FC = () => (
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/posts" element={<PostsPage />} />

        {/* Authentication Routing here */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Page for users */}
        <Route path="/profile" element={<ProfilePage />} />
    </Routes>
);
