import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AuthProvider } from "./Context/AuthContext.tsx";
import "./index.css";
import InitAuth from "./Context/InitAuth.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AuthProvider>
            <InitAuth>
                <App />
            </InitAuth>
        </AuthProvider>
    </StrictMode>
);
