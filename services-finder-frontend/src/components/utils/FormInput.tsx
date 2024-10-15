import React from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { LucideIcon } from "lucide-react";

interface FormInputProps {
    label: string;
    type: string;
    placeholder?: string;
    register: UseFormRegisterReturn;
    error?: FieldError;
    icon: LucideIcon;
    validationMessage?: string;
    options?: string[]; // Add options prop for select element
}

const FormInput: React.FC<FormInputProps> = ({
    label,
    type,
    placeholder,
    register,
    error,
    icon: Icon,
    validationMessage,
    options,
}) => (
    <div className="relative">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            {type === "select" ? (
                <select
                    {...register}
                    className="block w-full pl-12 pr-12 py-3 border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900">
                    {options?.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    placeholder={placeholder}
                    {...register}
                    className="block w-full pl-12 pr-12 py-3 border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900"
                />
            )}
        </div>
        {error && (
            <span className="text-red-500 text-sm mt-1">
                {validationMessage}
            </span>
        )}
    </div>
);

export default FormInput;
