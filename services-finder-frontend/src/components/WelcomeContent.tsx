import React from "react";
import { FaTools, FaUserFriends, FaStar } from "react-icons/fa";

const WelcomeContent: React.FC = () => {
    return (
        <div className="relative flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6">
                <h1 className="text-6xl font-extrabold text-white leading-tight sm:text-7xl">
                    Bienvenido a{" "}
                    <span className="text-indigo-400">Services Finder</span>
                </h1>
                <p className="text-lg text-white opacity-90 sm:text-xl md:text-2xl">
                    Descubre los mejores servicios en tu área con solo unos clics
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mt-6">
                    <div className="flex items-center space-x-2">
                        <FaTools className="text-indigo-400 text-3xl" />
                        <p className="text-md text-white opacity-80 sm:text-lg md:text-xl">
                            Profesionales confiables y calificados
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <FaUserFriends className="text-indigo-400 text-3xl" />
                        <p className="text-md text-white opacity-80 sm:text-lg md:text-xl">
                            Comunidad activa y recomendaciones
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <FaStar className="text-indigo-400 text-3xl" />
                        <p className="text-md text-white opacity-80 sm:text-lg md:text-xl">
                            Reseñas de usuarios
                        </p>
                    </div>
                </div>
                <div className="mt-8">
                    <button className="bg-indigo-400 text-gray-900 px-6 py-3 rounded-lg text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-400 transform hover:scale-105">
                        Comienza ahora
                    </button>
                </div>
            </div>
            <div className="absolute inset-0 -z-10">
                <img
                    src="https://images.unsplash.com/photo-1521747116042-5e9c6348ab5e"
                    alt="Background"
                    className="object-cover w-full h-full opacity-30 blur-md"
                />
            </div>
        </div>
    );
};

export default WelcomeContent;
