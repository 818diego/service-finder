import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { User as UserType } from "../../types/users";
import FormInput from "../../components/utils/FormInput";
import { Mail, Lock } from "lucide-react";
import { loginUser } from "../../services/usersFetch";
import { useAuth } from "../../Context/AuthContext";
import { jwtDecode } from "jwt-decode";

const LoginPage: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserType>();
    const [loading, setLoading] = useState(false);
    const [redirecting, setRedirecting] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const onSubmit: SubmitHandler<UserType> = async (data) => {
        setLoading(true);
        try {
            const response = await loginUser(data);
            login(response.token);
            localStorage.setItem("token", response.token);

            const decodedToken = jwtDecode(response.token);
            console.log("Decoded token:", decodedToken);
            
            setLoading(false);
            setRedirecting(true);
            toast.success("Successfully logged in!", {
                position: "top-center",
                autoClose: 2000,
                onClose: () => {
                    setRedirecting(false);
                    navigate("/");
                },
            });
        } catch (error: unknown) {
            setLoading(false);

            if (error instanceof Error) {
                console.error(error.message);
                toast.error(`Login failed: ${error.message}`, {
                    position: "top-center",
                });
            } else {
                console.error("An unexpected error occurred");
                toast.error("Login failed: An unexpected error occurred", {
                    position: "top-center",
                });
            }
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg transition-colors duration-300 ease-in-out">
            <ToastContainer />
            <div className="px-4 py-5 sm:px-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Welcome to Login for my app
                </h1>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-300">
                    This is the login page for the services finder app.
                </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
                {loading && <div className="text-center">Loading...</div>}
                {redirecting && (
                    <div className="text-center">Redirecting to home...</div>
                )}
                <FormInput
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    register={register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            message: "Invalid email address",
                        },
                    })}
                    error={errors.email}
                    icon={Mail}
                    validationMessage={
                        errors.email?.message || "Valid email is required"
                    }
                />
                <FormInput
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    register={register("password", {
                        required: "Password is required",
                        minLength: {
                            value: 8,
                            message:
                                "Password should be at least 8 characters long",
                        },
                    })}
                    error={errors.password}
                    icon={Lock}
                    validationMessage={
                        errors.password?.message || "Password is required"
                    }
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 transition-colors duration-300 ease-in-out">
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
