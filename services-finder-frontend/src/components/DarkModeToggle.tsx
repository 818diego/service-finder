import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const DarkModeToggle: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        const savedMode = localStorage.getItem("darkMode");
        return savedMode === null ? true : savedMode === "true";
    });

    const toggleDarkMode = () => {
        setIsDarkMode((prevMode) => {
            const newMode = !prevMode;
            localStorage.setItem("darkMode", newMode.toString());
            return newMode;
        });
    };

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDarkMode]);

    return (
        <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={toggleDarkMode}>
            {isDarkMode ? (
                <Sun className="h-6 w-6 text-yellow-500" />
            ) : (
                <Moon className="h-6 w-6 text-gray-400" />
            )}
        </div>
    );
};

export default DarkModeToggle;
