export interface User {
    profileImage?: string | File;
    _id?: string;
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
