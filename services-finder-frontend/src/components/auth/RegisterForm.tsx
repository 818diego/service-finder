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
    const [isTypingPassword, setIsTypingPassword] = useState(false);
    const [passwordCriteria, setPasswordCriteria] = useState({
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false,
    });

    const userType = watch("userType");
    const password = watch("password");
    // const confirmPassword = watch("confirmPassword");

    const onSubmit: SubmitHandler<RegisterUserType> = async (data) => {
        setLoading(true);
        try {
            await registerUser(data);
            setLoading(false);
            setSuccess(true);
            toast.success("¡Registro exitoso!");
        } catch (error: unknown) {
            setLoading(false);
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error("Ocurrió un error inesperado");
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
        if (isStep1Valid && isPasswordValid()) {
            setStep(2);
        } else {
            toast.error(
                "La contraseña debe cumplir con todos los requisitos de seguridad."
            );
        }
    };

    const handlePreviousStep = () => setStep(1);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPasswordStrength(zxcvbn(value).score);
        setIsTypingPassword(value.length > 0);
        setPasswordCriteria({
            hasUpperCase: /[A-Z]/.test(value),
            hasLowerCase: /[a-z]/.test(value),
            hasNumber: /\d/.test(value),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
        });
    };

    const isPasswordValid = () => {
        return (
            passwordCriteria.hasUpperCase &&
            passwordCriteria.hasLowerCase &&
            passwordCriteria.hasNumber &&
            passwordCriteria.hasSpecialChar &&
            passwordStrength >= 3
        );
    };

    const getPasswordStrengthLabel = () => {
        switch (passwordStrength) {
            case 0:
                return {
                    label: "Muy débil",
                    icon: <ShieldOff className="h-5 w-5 text-red-500" />,
                };
            case 1:
                return {
                    label: "Débil",
                    icon: <ShieldAlert className="h-5 w-5 text-yellow-500" />,
                };
            case 2:
                return {
                    label: "Media",
                    icon: <Shield className="h-5 w-5 text-yellow-500" />,
                };
            case 3:
                return {
                    label: "Fuerte",
                    icon: <ShieldCheck className="h-5 w-5 text-green-500" />,
                };
            case 4:
                return {
                    label: "Muy fuerte",
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
                <p className="text-lg font-semibold">Paso {step} de 2</p>
            </div>
            {loading && <div className="text-center">Cargando...</div>}
            {!loading && !success && (
                <>
                    {step === 1 && (
                        <div className="transition duration-500 transform space-y-4">
                            <FormInput
                                label="Nombre de usuario"
                                type="text"
                                placeholder="Ingresa tu nombre de usuario"
                                register={register("username", {
                                    required: true,
                                    minLength: 5,
                                })}
                                error={errors.username}
                                icon={User}
                                validationMessage="El nombre de usuario es obligatorio y debe tener al menos 5 caracteres"
                            />
                            {errors.username && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.username.message}
                                </p>
                            )}
                            <FormInput
                                label="Correo electrónico"
                                type="email"
                                placeholder="Ingresa tu correo electrónico"
                                register={register("email", {
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message:
                                            "Dirección de correo electrónico no válida",
                                    },
                                })}
                                error={errors.email}
                                icon={Mail}
                                validationMessage={
                                    errors.email
                                        ? errors.email.message
                                        : "Se requiere un correo electrónico válido"
                                }
                            />
                            <div className="relative">
                                <FormInput
                                    label="Contraseña"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Ingresa tu contraseña"
                                    register={register("password", {
                                        required: true,
                                        minLength: 8,
                                        onChange: handlePasswordChange,
                                    })}
                                    error={errors.password}
                                    icon={Lock}
                                    validationMessage="La contraseña es obligatoria y debe tener al menos 8 caracteres"
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
                            {isTypingPassword && (
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 relative transition-all duration-300">
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
                            )}
                            {isTypingPassword && (
                                <div className="flex items-center justify-center mt-2">
                                    {getPasswordStrengthLabel().icon}
                                    <span className="ml-2 text-sm font-medium">
                                        {getPasswordStrengthLabel().label}
                                    </span>
                                </div>
                            )}
                            {isTypingPassword && (
                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                    <div
                                        className={
                                            passwordCriteria.hasUpperCase
                                                ? "text-green-500"
                                                : "text-red-500"
                                        }>
                                        {passwordCriteria.hasUpperCase
                                            ? "✔"
                                            : "✘"}{" "}
                                        Al menos una letra mayúscula
                                    </div>
                                    <div
                                        className={
                                            passwordCriteria.hasLowerCase
                                                ? "text-green-500"
                                                : "text-red-500"
                                        }>
                                        {passwordCriteria.hasLowerCase
                                            ? "✔"
                                            : "✘"}{" "}
                                        Al menos una letra minúscula
                                    </div>
                                    <div
                                        className={
                                            passwordCriteria.hasNumber
                                                ? "text-green-500"
                                                : "text-red-500"
                                        }>
                                        {passwordCriteria.hasNumber ? "✔" : "✘"}{" "}
                                        Al menos un número
                                    </div>
                                    <div
                                        className={
                                            passwordCriteria.hasSpecialChar
                                                ? "text-green-500"
                                                : "text-red-500"
                                        }>
                                        {passwordCriteria.hasSpecialChar
                                            ? "✔"
                                            : "✘"}{" "}
                                        Al menos un carácter especial
                                    </div>
                                </div>
                            )}
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                            <div className="relative">
                                <FormInput
                                    label="Confirmar contraseña"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Confirma tu contraseña"
                                    register={register("confirmPassword", {
                                        required: true,
                                        validate: (value) =>
                                            value === password ||
                                            "Las contraseñas no coinciden",
                                    })}
                                    error={errors.confirmPassword}
                                    icon={Lock}
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
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                            <button
                                type="button"
                                onClick={handleNextStep}
                                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 transition-colors duration-300 ease-in-out">
                                Siguiente
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="transition duration-500 transform space-y-4">
                            <FormInput
                                label="Nombre"
                                type="text"
                                placeholder="Ingresa tu nombre"
                                register={register("firstName", {
                                    required: true,
                                    minLength: 3,
                                })}
                                error={errors.firstName}
                                icon={UserCheck}
                                validationMessage="El nombre es obligatorio y debe tener al menos 3 caracteres"
                            />
                            {errors.firstName && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.firstName.message}
                                </p>
                            )}
                            <FormInput
                                label="Apellido"
                                type="text"
                                placeholder="Ingresa tu apellido"
                                register={register("lastName", {
                                    required: true,
                                    minLength: 3,
                                })}
                                error={errors.lastName}
                                icon={UserCheck}
                                validationMessage="El apellido es obligatorio y debe tener al menos 3 caracteres"
                            />
                            {errors.lastName && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.lastName.message}
                                </p>
                            )}
                            <FormInput
                                label="Tipo de usuario"
                                type="select"
                                placeholder="Selecciona el tipo de usuario"
                                register={register("userType", {
                                    required: true,
                                })}
                                error={errors.userType}
                                icon={Briefcase}
                                validationMessage="El tipo de usuario es obligatorio"
                                options={[
                                    "Selecciona una opción",
                                    "Proveedor",
                                    "Cliente",
                                ]}
                            />
                            {errors.userType && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.userType.message}
                                </p>
                            )}
                            <FormInput
                                label="Dirección"
                                type="text"
                                placeholder="Ingresa tu dirección"
                                register={register("address", {
                                    required: true,
                                    minLength: 10,
                                })}
                                error={errors.address}
                                icon={Home}
                                validationMessage="La dirección es obligatoria y debe tener al menos 10 caracteres"
                            />
                            {errors.address && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.address.message}
                                </p>
                            )}
                            {userType === "Proveedor" && (
                                <FormInput
                                    label="Especialidad"
                                    type="text"
                                    placeholder="Ingresa tu especialidad"
                                    register={register("specialty", {
                                        required: true,
                                    })}
                                    error={errors.specialty}
                                    icon={NotebookPen}
                                    validationMessage="La especialidad es obligatoria para Proveedor"
                                />
                            )}
                            {errors.specialty && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.specialty.message}
                                </p>
                            )}
                            <div className="flex justify-between space-x-4">
                                <button
                                    type="button"
                                    onClick={handlePreviousStep}
                                    className="bg-gray-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-gray-600 transition-colors duration-300 ease-in-out">
                                    Atrás
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 transition-colors duration-300 ease-in-out">
                                    Registrarse
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
                    <strong className="font-bold">¡Registro exitoso!</strong>
                    <span className="block sm:inline">
                        {" "}
                        ¿Quieres{" "}
                        <a
                            href="/login"
                            className="text-blue-500 underline font-bold">
                            iniciar sesión
                        </a>
                        ?
                    </span>
                </div>
            )}
        </form>
    );
};

export default RegisterForm;
