import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Add this import
import RegisterForm from "../../components/auth/RegisterForm";

const RegisterPage: React.FC = () => {
    const [userType, setUserType] = useState<"Cliente" | "Proveedor" | null>(null);
    const [confirmed, setConfirmed] = useState(false);

    useEffect(() => {
        document.body.style.backgroundColor = "#1e293b"; // Set dark background color
        return () => {
            document.body.style.backgroundColor = ""; // Reset background color on component unmount
        };
    }, []);

    const handleUserTypeSelect = (type: "Cliente" | "Proveedor") => {
        setUserType(type);
    };

    const handleConfirm = () => {
        setConfirmed(true);
    };

    return (
        <div className="bg-slate-800 rounded-lg p-8 max-w-lg mx-auto mt-10 transition-colors duration-300 ease-in-out">
            {!confirmed ? (
                <div>
                    <h1 className="text-3xl font-bold text-gray-100 mb-6 text-center">
                        Regístrate como cliente o proveedor
                    </h1>
                    <div className="grid grid-cols-1 gap-4">
                        {/* Opción Cliente */}
                        <div
                            onClick={() => handleUserTypeSelect("Cliente")}
                            className={`relative flex items-center justify-between border border-gray-600 rounded-lg p-4 cursor-pointer hover:bg-blue-900 transition duration-300 ease-in-out ${
                                userType === "Cliente"
                                    ? "ring-2 ring-blue-500 bg-blue-900"
                                    : ""
                            }`}>
                            <span className="text-lg font-medium text-gray-300">
                                Soy un cliente, contratando para un proyecto
                            </span>
                        </div>
                        {/* Opción Proveedor */}
                        <div
                            onClick={() => handleUserTypeSelect("Proveedor")}
                            className={`relative flex items-center justify-between border border-gray-600 rounded-lg p-4 cursor-pointer hover:bg-green-900 transition duration-300 ease-in-out ${
                                userType === "Proveedor"
                                    ? "ring-2 ring-green-500 bg-green-900"
                                    : ""
                            }`}>
                            <span className="text-lg font-medium text-gray-300">
                                Soy un Freelancer, buscando trabajo
                            </span>
                        </div>
                    </div>
                    <button
                        disabled={!userType}
                        onClick={handleConfirm}
                        className={`mt-6 w-full py-2 px-4 rounded-lg text-white font-medium transition-colors duration-300 ${
                            userType
                                ? "bg-blue-700 hover:bg-blue-800"
                                : "bg-gray-700 cursor-not-allowed"
                        }`}>
                        Continuar
                    </button>
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-400">
                            ¿Ya tienes una cuenta?{" "}
                            <Link
                                to="/login"
                                className="text-blue-400 hover:underline">
                                Inicia sesión
                            </Link>
                        </p>
                    </div>
                </div>
            ) : (
                <div>
                    <h1 className="text-3xl font-bold text-gray-100 mb-6 text-center">
                        Registro de {userType}
                    </h1>
                    {userType && <RegisterForm userType={userType} />}
                    <button
                        onClick={() => setConfirmed(false)}
                        className="mt-4 w-full py-2 px-4 rounded-lg text-white font-medium bg-gray-600 hover:bg-gray-700 transition-colors duration-300">
                        Regresar
                    </button>
                </div>
            )}
        </div>
    );
};

export default RegisterPage;
