import React from "react";
import RegisterForm from "../../components/auth/RegisterForm";

const RegisterPage: React.FC = () => (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-lg mx-auto mt-10 transition-colors duration-300 ease-in-out">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
            Register to My App
        </h1>
        <RegisterForm />
    </div>
);

export default RegisterPage;