import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
    User,
    Mail,
    Lock,
    Home,
    NotebookPen,
    Briefcase,
    UserCheck,
    Eye,
    EyeOff,
    Shield,
    ShieldCheck,
    ShieldAlert,
    ShieldOff,
} from "lucide-react";
import { registerUser } from "../../services/usersFetch";
import { User as UserType } from "../../types/users";
import FormInput from "../utils/FormInput";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import zxcvbn from "zxcvbn";

interface RegisterUserType extends UserType {
    confirmPassword: string;
}

const RegisterForm: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        trigger,
    } = useForm<RegisterUserType>();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const userType = watch("userType");
    const password = watch("password");
    // const confirmPassword = watch("confirmPassword");

    const onSubmit: SubmitHandler<RegisterUserType> = async (data) => {
        setLoading(true);
        try {
            await registerUser(data);
            setLoading(false);
            setSuccess(true);
            toast.success("Registration successful!");
        } catch (error: unknown) {
            setLoading(false);
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error("An unexpected error occurred");
            }
        }
    };

    const handleNextStep = async () => {
        const isStep1Valid = await trigger([
            "username",
            "email",
            "password",
            "confirmPassword",
        ]);
        if (isStep1Valid && passwordStrength >= 3) {
            setStep(2);
        } else {
            toast.error("Password must be strong (High security).");
        }
    };

    const handlePreviousStep = () => setStep(1);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPasswordStrength(zxcvbn(value).score);
    };

    const getPasswordStrengthLabel = () => {
        switch (passwordStrength) {
            case 0:
                return {
                    label: "Very Weak",
                    icon: <ShieldOff className="h-5 w-5 text-red-500" />,
                };
            case 1:
                return {
                    label: "Weak",
                    icon: <ShieldAlert className="h-5 w-5 text-yellow-500" />,
                };
            case 2:
                return {
                    label: "Medium",
                    icon: <Shield className="h-5 w-5 text-yellow-500" />,
                };
            case 3:
                return {
                    label: "Strong",
                    icon: <ShieldCheck className="h-5 w-5 text-green-500" />,
                };
            case 4:
                return {
                    label: "Very Strong",
                    icon: <ShieldCheck className="h-5 w-5 text-green-700" />,
                };
            default:
                return { label: "", icon: null };
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
            <div className="text-center text-gray-600 dark:text-gray-400">
                <div className="flex justify-center space-x-4 mb-4">
                    <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            step === 1
                                ? "bg-blue-500 text-white"
                                : "bg-gray-300 text-gray-600"
                        }`}>
                        <span className="font-bold">1</span>
                    </div>
                    <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            step === 2
                                ? "bg-blue-500 text-white"
                                : "bg-gray-300 text-gray-600"
                        }`}>
                        <span className="font-bold">2</span>
                    </div>
                </div>
                <p className="text-lg font-semibold">Step {step} of 2</p>
            </div>
            {loading && <div className="text-center">Loading...</div>}
            {!loading && !success && (
                <>
                    {step === 1 && (
                        <div className="transition duration-500 transform space-y-4">
                            <FormInput
                                label="Username"
                                type="text"
                                placeholder="Enter your username"
                                register={register("username", {
                                    required: true,
                                    minLength: 5,
                                })}
                                error={errors.username}
                                icon={User}
                                validationMessage="Username is required and should be at least 5 characters long"
                            />
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
                                    errors.email
                                        ? errors.email.message
                                        : "Valid email is required"
                                }
                            />
                            <div className="relative">
                                <FormInput
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    register={register("password", {
                                        required: true,
                                        minLength: 8,
                                        onChange: handlePasswordChange,
                                    })}
                                    error={errors.password}
                                    icon={Lock}
                                    validationMessage="Password is required and should be at least 8 characters long"
                                />
                                <div
                                    className="absolute mt-6 inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }>
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-500" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-500" />
                                    )}
                                </div>
                            </div>
                            <div className="relative">
                                <FormInput
                                    label="Confirm Password"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Confirm your password"
                                    register={register("confirmPassword", {
                                        required: true,
                                        validate: (value) =>
                                            value === password ||
                                            "Passwords do not match",
                                    })}
                                    error={errors.confirmPassword}
                                    icon={Lock}
                                    validationMessage="Passwords must match"
                                />
                                <div
                                    className="absolute mt-6 inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }>
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-500" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-500" />
                                    )}
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 relative">
                                <div
                                    className={`h-2.5 rounded-full transition-all duration-300 ${
                                        passwordStrength === 0
                                            ? "bg-red-500"
                                            : passwordStrength === 1
                                            ? "bg-yellow-500"
                                            : passwordStrength === 2
                                            ? "bg-yellow-500"
                                            : passwordStrength === 3
                                            ? "bg-green-500"
                                            : "bg-green-700"
                                    }`}
                                    style={{
                                        width: `${
                                            (passwordStrength + 1) * 20
                                        }%`,
                                    }}></div>
                            </div>
                            <div className="flex items-center justify-center mt-2">
                                {getPasswordStrengthLabel().icon}
                                <span className="ml-2 text-sm font-medium">
                                    {getPasswordStrengthLabel().label}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={handleNextStep}
                                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 transition-colors duration-300 ease-in-out">
                                Next
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="transition duration-500 transform space-y-4">
                            <FormInput
                                label="First Name"
                                type="text"
                                placeholder="Enter your first name"
                                register={register("firstName", {
                                    required: true,
                                    minLength: 3,
                                })}
                                error={errors.firstName}
                                icon={UserCheck}
                                validationMessage="First name is required and should be at least 3 characters long"
                            />
                            <FormInput
                                label="Last Name"
                                type="text"
                                placeholder="Enter your last name"
                                register={register("lastName", {
                                    required: true,
                                    minLength: 3,
                                })}
                                error={errors.lastName}
                                icon={UserCheck}
                                validationMessage="Last name is required and should be at least 3 characters long"
                            />
                            <FormInput
                                label="User Type"
                                type="select"
                                placeholder="Select user type"
                                register={register("userType", {
                                    required: true,
                                })}
                                error={errors.userType}
                                icon={Briefcase}
                                validationMessage="User type is required"
                                options={[
                                    "Selecciona una opción",
                                    "Proveedor",
                                    "Cliente",
                                ]}
                            />
                            <FormInput
                                label="Address"
                                type="text"
                                placeholder="Enter your address"
                                register={register("address", {
                                    required: true,
                                    minLength: 10,
                                })}
                                error={errors.address}
                                icon={Home}
                                validationMessage="Address is required and should be at least 10 characters long"
                            />
                            {userType === "Proveedor" && (
                                <FormInput
                                    label="Specialty"
                                    type="text"
                                    placeholder="Enter your specialty"
                                    register={register("specialty", {
                                        required: true,
                                    })}
                                    error={errors.specialty}
                                    icon={NotebookPen}
                                    validationMessage="Specialty is required for Proveedor"
                                />
                            )}
                            <div className="flex justify-between space-x-4">
                                <button
                                    type="button"
                                    onClick={handlePreviousStep}
                                    className="bg-gray-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-gray-600 transition-colors duration-300 ease-in-out">
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 transition-colors duration-300 ease-in-out">
                                    Register
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
            {success && (
                <div
                    className="text-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                    role="alert">
                    <strong className="font-bold">
                        Registration successful!
                    </strong>
                    <span className="block sm:inline">
                        {" "}
                        Do you want to{" "}
                        <a
                            href="/login"
                            className="text-blue-500 underline font-bold">
                            log in
                        </a>
                        ?
                    </span>
                </div>
            )}
        </form>
    );
};

export default RegisterForm;
