import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { User as UserType } from "../../types/users";
import FormInput from "../../components/utils/FormInput";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
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
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<UserType> = async (data) => {
        setLoading(true);
                try {
            const response = await loginUser(data);
            login(response.token);
            localStorage.setItem("token", response.token);
        
            const decodedToken = jwtDecode(response.token);
            console.log("Decoded token:", decodedToken);
        
            navigate("/"); 
            toast.success("Successfully logged in!",{
                position: "top-center",
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
        <div className="flex items-center justify-center mt-32 bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                    Welcome Back
                </h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {loading && <div className="text-center">Loading...</div>}
                    <FormInput
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        register={register("email", {
                            required: "Email is required",
                            pattern: {
                                value:
                                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                message: "Invalid email address",
                            },
                        })}
                        error={errors.email}
                        icon={Mail}
                        validationMessage={
                            errors.email?.message || "Valid email is required"
                        }
                    />
                    <div className="relative">
                        <FormInput
                            label="Password"
                            type={showPassword ? "text" : "password"}
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
                        <div
                            className="absolute mt-6 inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-500" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-500" />
                            )}
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;