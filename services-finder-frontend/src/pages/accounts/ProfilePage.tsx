// pages/ProfilePage.tsx
import React from "react";
import { useAuth } from "../../Context/AuthContext";

const ProfilePage: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg transition-colors duration-300 ease-in-out">
            <div className="px-4 py-5 sm:px-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {user
                        ? `Bienvenido ${user.username} a tu perfil`
                        : "Bienvenido a tu perfil"}
                </h1>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-300">
                    Esta es la página de perfil de un usuario.
                </p>
            </div>
        </div>
    );
};

export default ProfilePage;
