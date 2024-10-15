export interface Service {
    id: number;
    image: string;
    provider: string;
    rating: number;
    specialty: string;
    service: string;
    description: string;
    tools: string[];
    exampleImages: string[];
    price: string;
}

export const popularServices: Service[] = [
    {
        id: 1,
        image: "src/assets/images/person1.jpg",
        provider: "Mahmoud Bhk",
        rating: 5.0,
        specialty: "Diseñador de UI",
        service: "Diseño de sitios web",
        description:
            "Hola, me llamo Mahmoud. Soy un experto en creación de sitios web con experiencia en diseño de UI/UX.",
        tools: ["Figma", "Sketch", "Adobe XD"],
        exampleImages: [
            "src/assets/images/work1.jpg",
            "src/assets/images/work2.jpg",
            "src/assets/images/work3.jpg",
        ],
        price: "USD 80",
    },
    {
        id: 2,
        image: "src/assets/images/person2.jpg",
        provider: "Samantha Lee",
        rating: 4.9,
        specialty: "Desarrolladora Frontend",
        service: "Desarrollo de aplicaciones web",
        description:
            "Samantha es una experta en crear interfaces de usuario atractivas utilizando las últimas tecnologías de frontend.",
        tools: ["React", "Tailwind CSS", "JavaScript"],
        exampleImages: [
            "src/assets/images/work1.jpg",
            "src/assets/images/work2.jpg",
            "src/assets/images/work3.jpg",
        ],
        price: "USD 100",
    },
    {
        id: 3,
        image: "src/assets/images/person1.jpg",
        provider: "Carlos Jiménez",
        rating: 4.7,
        specialty: "Ingeniero de DevOps",
        service: "Automatización de despliegues",
        description:
            "Carlos tiene experiencia en la automatización de procesos de CI/CD utilizando herramientas como Jenkins y Docker.",
        tools: ["Docker", "Kubernetes", "AWS"],
        exampleImages: [
            "src/assets/images/work1.jpg",
            "src/assets/images/work2.jpg",
            "src/assets/images/work3.jpg",
        ],
        price: "USD 150",
    },
    {
        id: 4,
        image: "src/assets/images/person1.jpg",
        provider: "Carlos Jiménez",
        rating: 4.7,
        specialty: "Ingeniero de DevOps",
        service: "Automatización de despliegues",
        description:
            "Carlos tiene experiencia en la automatización de procesos de CI/CD utilizando herramientas como Jenkins y Docker.",
        tools: ["Docker", "Kubernetes", "AWS"],
        exampleImages: [
            "src/assets/images/work1.jpg",
            "src/assets/images/work2.jpg",
            "src/assets/images/work3.jpg",
        ],
        price: "USD 150",
    },
    {
        id: 5,
        image: "src/assets/images/person1.jpg",
        provider: "Carlos Jiménez",
        rating: 4.7,
        specialty: "Ingeniero de DevOps",
        service: "Automatización de despliegues",
        description:
            "Carlos tiene experiencia en la automatización de procesos de CI/CD utilizando herramientas como Jenkins y Docker.",
        tools: ["Docker", "Kubernetes", "AWS"],
        exampleImages: [
            "src/assets/images/work1.jpg",
            "src/assets/images/work2.jpg",
            "src/assets/images/work3.jpg",
        ],
        price: "USD 150",
    },
    {
        id: 6,
        image: "src/assets/images/person1.jpg",
        provider: "Carlos Jiménez",
        rating: 4.7,
        specialty: "Ingeniero de DevOps",
        service: "Automatización de despliegues",
        description:
            "Carlos tiene experiencia en la automatización de procesos de CI/CD utilizando herramientas como Jenkins y Docker.",
        tools: ["Docker", "Kubernetes", "AWS"],
        exampleImages: [
            "src/assets/images/work1.jpg",
            "src/assets/images/work2.jpg",
            "src/assets/images/work3.jpg",
        ],
        price: "USD 150",
    },
    {
        id: 7,
        image: "src/assets/images/person1.jpg",
        provider: "Carlos Jiménez",
        rating: 4.7,
        specialty: "Ingeniero de DevOps",
        service: "Automatización de despliegues",
        description:
            "Carlos tiene experiencia en la automatización de procesos de CI/CD utilizando herramientas como Jenkins y Docker.",
        tools: ["Docker", "Kubernetes", "AWS"],
        exampleImages: [
            "src/assets/images/work1.jpg",
            "src/assets/images/work2.jpg",
            "src/assets/images/work3.jpg",
        ],
        price: "USD 150",
    },
    {
        id: 8,
        image: "src/assets/images/person1.jpg",
        provider: "Carlos Jiménez",
        rating: 4.7,
        specialty: "Ingeniero de DevOps",
        service: "Automatización de despliegues",
        description:
            "Carlos tiene experiencia en la automatización de procesos de CI/CD utilizando herramientas como Jenkins y Docker.",
        tools: ["Docker", "Kubernetes", "AWS"],
        exampleImages: [
            "src/assets/images/work1.jpg",
            "src/assets/images/work2.jpg",
            "src/assets/images/work3.jpg",
        ],
        price: "USD 150",
    },
    {
        id: 9,
        image: "src/assets/images/person1.jpg",
        provider: "Carlos Jiménez",
        rating: 4.7,
        specialty: "Ingeniero de DevOps",
        service: "Automatización de despliegues",
        description:
            "Carlos tiene experiencia en la automatización de procesos de CI/CD utilizando herramientas como Jenkins y Docker.",
        tools: ["Docker", "Kubernetes", "AWS"],
        exampleImages: [
            "src/assets/images/work1.jpg",
            "src/assets/images/work2.jpg",
            "src/assets/images/work3.jpg",
        ],
        price: "USD 150",
    },
];

export const randomServices: Service[] = [
    {
        id: 4,
        image: "src/assets/images/person2.jpg",
        provider: "John Doe",
        rating: 4.8,
        specialty: "Desarrollador Full Stack",
        service: "Desarrollo de aplicaciones web",
        description:
            "John es un experto en tecnologías de frontend y backend, desarrollando soluciones completas para empresas.",
        tools: ["React", "Node.js", "GraphQL"],
        exampleImages: [
            "src/assets/images/work1.jpg",
            "src/assets/images/work2.jpg",
            "src/assets/images/work3.jpg",
        ],
        price: "USD 120",
    },
    {
        id: 5,
        image: "src/assets/images/person1.jpg",
        provider: "Emma Williams",
        rating: 4.6,
        specialty: "Diseñadora Gráfica",
        service: "Diseño de logotipos",
        description:
            "Emma ha diseñado logotipos para marcas internacionales y ofrece un servicio completo de branding.",
        tools: ["Photoshop", "Illustrator", "InDesign"],
        exampleImages: [
            "src/assets/images/work1.jpg",
            "src/assets/images/work2.jpg",
            "src/assets/images/work3.jpg",
        ],
        price: "USD 75",
    },
    {
        id: 6,
        image: "src/assets/images/person2.jpg",
        provider: "Michael Brooks",
        rating: 4.9,
        specialty: "Especialista en Marketing Digital",
        service: "Estrategia de marketing en redes sociales",
        description:
            "Michael ha trabajado con grandes empresas para optimizar sus campañas de marketing en plataformas como Facebook e Instagram.",
        tools: ["Hootsuite", "Google Ads", "Facebook Ads"],
        exampleImages: [
            "src/assets/images/work1.jpg",
            "src/assets/images/work2.jpg",
            "src/assets/images/work3.jpg",
        ],
        price: "USD 200",
    },
    {
        id: 7,
        image: "src/assets/images/person2.jpg",
        provider: "Michael Brooks",
        rating: 4.9,
        specialty: "Especialista en Marketing Digital",
        service: "Estrategia de marketing en redes sociales",
        description:
            "Michael ha trabajado con grandes empresas para optimizar sus campañas de marketing en plataformas como Facebook e Instagram.",
        tools: ["Hootsuite", "Google Ads", "Facebook Ads"],
        exampleImages: [
            "src/assets/images/work1.jpg",
            "src/assets/images/work2.jpg",
            "src/assets/images/work3.jpg",
        ],
        price: "USD 200",
    },
    {
        id: 8,
        image: "src/assets/images/person2.jpg",
        provider: "Michael Brooks",
        rating: 4.9,
        specialty: "Especialista en Marketing Digital",
        service: "Estrategia de marketing en redes sociales",
        description:
            "Michael ha trabajado con grandes empresas para optimizar sus campañas de marketing en plataformas como Facebook e Instagram.",
        tools: ["Hootsuite", "Google Ads", "Facebook Ads"],
        exampleImages: [
            "src/assets/images/work1.jpg",
            "src/assets/images/work2.jpg",
            "src/assets/images/work3.jpg",
        ],
        price: "USD 200",
    },
    {
        id: 9,
        image: "src/assets/images/person2.jpg",
        provider: "Michael Brooks",
        rating: 4.9,
        specialty: "Especialista en Marketing Digital",
        service: "Estrategia de marketing en redes sociales",
        description:
            "Michael ha trabajado con grandes empresas para optimizar sus campañas de marketing en plataformas como Facebook e Instagram.",
        tools: ["Hootsuite", "Google Ads", "Facebook Ads"],
        exampleImages: [
            "src/assets/images/work1.jpg",
            "src/assets/images/work2.jpg",
            "src/assets/images/work3.jpg",
        ],
        price: "USD 200",
    },
];
