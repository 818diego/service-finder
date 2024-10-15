import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { User, Mail, Lock, Home, Briefcase, UserCheck } from "lucide-react";
import { registerUser } from "../../services/usersFetch";
import { User as UserType } from "../../types/users";
import FormInput from "../utils/FormInput";

const RegisterForm: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        trigger,
    } = useForm<UserType>();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const userType = watch("userType");

    const onSubmit: SubmitHandler<UserType> = async (data) => {
        setLoading(true);
        try {
            await registerUser(data);
            setLoading(false);
            setSuccess(true);
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
        const isStep1Valid = await trigger(["username", "email", "password"]);
        if (isStep1Valid) {
            setStep(2);
        }
    };

    const handlePreviousStep = () => setStep(1);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
            <div className="text-center text-gray-600 dark:text-gray-400">
                Step {step} of 2
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
                            <FormInput
                                label="Password"
                                type="password"
                                placeholder="Enter your password"
                                register={register("password", {
                                    required: true,
                                    minLength: 8,
                                })}
                                error={errors.password}
                                icon={Lock}
                                validationMessage="Password is required and should be at least 8 characters long"
                            />
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
                                options={["Proveedor", "Cliente"]}
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
                            <FormInput
                                label="Specialty (Optional)"
                                type="text"
                                placeholder="Enter your specialty"
                                register={register("specialty", {
                                    required: userType === "Proveedor",
                                })}
                                error={errors.specialty}
                                icon={Briefcase}
                                validationMessage="Specialty is required for Proveedor"
                            />
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
                <div className="text-center">
                    <p>
                        Registration successful! Do you want to{" "}
                        <a href="/login" className="text-blue-500">
                            log in
                        </a>
                        ?
                    </p>
                </div>
            )}
        </form>
    );
};

export default RegisterForm;
