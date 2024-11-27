import React from "react";

const AboutPage: React.FC = () => {
    return (
        <div className="space-y-12">
            {/* Sección de encabezado */}
            <div className="text-center py-12">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                    Acerca de Services Finder
                </h1>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                    Conecta a profesionales calificados con personas que
                    necesitan sus servicios de manera sencilla y moderna.
                </p>
            </div>

            {/* Sección de misión y visión */}
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        Nuestra Misión
                    </h2>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">
                        Simplificar cómo las personas encuentran y se conectan
                        con proveedores de servicios, utilizando tecnología
                        accesible y confiable.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        Nuestra Visión
                    </h2>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">
                        Crear un mundo donde los servicios de calidad estén al
                        alcance de todos, promoviendo confianza y productividad.
                    </p>
                </div>
            </div>

            {/* Sección de características principales */}
            <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    ¿Por qué elegirnos?
                </h2>
                <ul className="mt-6 space-y-4">
                    <li className="flex items-start">
                        <span className="mr-3 text-green-500">✔</span>
                        <p className="text-gray-600 dark:text-gray-300">
                            Diseño intuitivo y fácil de usar para una
                            experiencia sin complicaciones.
                        </p>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-3 text-green-500">✔</span>
                        <p className="text-gray-600 dark:text-gray-300">
                            Comunicación segura y directa entre clientes y
                            proveedores.
                        </p>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-3 text-green-500">✔</span>
                        <p className="text-gray-600 dark:text-gray-300">
                            Amplia variedad de servicios para satisfacer todas
                            tus necesidades.
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default AboutPage;
