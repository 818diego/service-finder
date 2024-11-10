import React from "react";

interface TooltipProps {
    text: string;
    children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
    return (
        <div className="relative flex items-center justify-center group">
            {children}
            <span className="absolute top-full mt-2 hidden group-hover:block whitespace-nowrap bg-gray-700 text-white text-xs rounded py-1 px-2 z-10">
                {text}
                <svg
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-2 h-2 fill-gray-700"
                    viewBox="0 0 255 255">
                </svg>
            </span>
        </div>
    );
};

export default Tooltip;
