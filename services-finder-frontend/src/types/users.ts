export interface User {
    username: string;
    firstName: string;
    lastName: string;
    userType: "Cliente" | "Proveedor";
    email: string;
    address: string;
    specialty?: string;
    password: string;
}

export interface RegisterResponse {
    token: string;
    message: string;
}
