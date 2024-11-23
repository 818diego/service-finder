import React from "react";
import { Mail, Phone } from "lucide-react";
import { FaGithub } from "react-icons/fa";

const ContactPage: React.FC = () => {
    return (
        <div className="space-y-8 px-4 md:px-8 lg:px-16 py-8 dark:bg-gray-900 transition-colors">
            {/* Header Section */}
            <div className="text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
                    Contáctanos
                </h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
                    Estamos aquí para ayudarte. Ponte en contacto con nuestro
                    equipo mediante los siguientes canales o envíanos un mensaje
                    directo.
                </p>
            </div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition">
                    <Mail className="h-8 w-8 text-indigo-500 dark:text-indigo-400 mr-4" />
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-300">
                            Correos Electrónicos
                        </p>
                        <p className="text-base text-gray-900 dark:text-white">
                            diego.merino@uabc.edu.mx
                        </p>
                        <p className="text-base text-gray-900 dark:text-white">
                            orlando.castaneda@uabc.edu.mx
                        </p>
                    </div>
                </div>

                <div className="flex items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition">
                    <FaGithub className="h-8 w-8 text-indigo-500 dark:text-indigo-400 mr-4" />
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-300">
                            GitHub
                        </p>
                        <p>
                            <a
                                href="https://github.com/818diego"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 dark:text-indigo-400 hover:underline">
                                818diego
                            </a>
                        </p>
                        <p>
                            <a
                                href="https://github.com/orrrrli"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 dark:text-indigo-400 hover:underline">
                                orrrrli
                            </a>
                        </p>
                    </div>
                </div>

                <div className="flex items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition">
                    <Phone className="h-8 w-8 text-indigo-500 dark:text-indigo-400 mr-4" />
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-300">
                            Teléfono
                        </p>
                        <p className="text-base text-gray-900 dark:text-white">
                            +52 (646) 123-4567
                        </p>
                    </div>
                </div>
            </div>

            {/* Contact Form */}
            <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Envíanos un mensaje
                </h2>
                <form className="mt-8 space-y-6">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Nombre
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            className="mt-2 block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                            placeholder="Tu nombre"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="mt-2 block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                            placeholder="tu@correo.com"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="message"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Mensaje
                        </label>
                        <textarea
                            name="message"
                            id="message"
                            rows={5}
                            className="mt-2 block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                            placeholder="Escribe tu mensaje aquí..."></textarea>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition">
                            Enviar Mensaje
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactPage;
