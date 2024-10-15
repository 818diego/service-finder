import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactPage: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg transition-colors duration-300 ease-in-out">
            <div className="px-4 py-5 sm:px-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Contact Us
                </h1>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-300">
                    Get in touch with our team.
                </p>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200 dark:sm:divide-gray-700">
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 flex items-center">
                            <Mail className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-300" />
                            Email
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                            contact@example.com
                        </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 flex items-center">
                            <Phone className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-300" />
                            Phone
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                            +1 (555) 123-4567
                        </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 flex items-center">
                            <MapPin className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-300" />
                            Address
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                            123 Web Dev Lane, Internet City, 12345
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    );
};

export default ContactPage;
