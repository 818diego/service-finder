import React, { useState, useEffect, useRef } from "react";
import { Bell, Mail, MailOpen, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Tooltip from "./Tooltip";

interface Notification {
    type: string;
    message: string;
    isRead: boolean;
}

interface NotificationDropdownProps {
    isOpen: boolean;
    notifications: Notification[];
    notificationCount: number;
    toggleNotifications: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
    isOpen,
    notifications,
    notificationCount,
    toggleNotifications,
}) => {
    const [localNotifications, setLocalNotifications] = useState(notifications);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setLocalNotifications(notifications);
    }, [notifications]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                toggleNotifications();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, toggleNotifications]);

    const handleNotificationClick = (index: number) => {
        const updatedNotifications = [...localNotifications];
        updatedNotifications[index].isRead = true;
        setLocalNotifications(updatedNotifications);
    };

    const clearNotifications = () => {
        setLocalNotifications([]);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <Tooltip text="Notifications">
                <button onClick={toggleNotifications} className="relative">
                    <Bell className="h-6 w-6 text-gray-400 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 cursor-pointer" />
                    {notificationCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                            {notificationCount}
                        </span>
                    )}
                </button>
            </Tooltip>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-800 dark:text-gray-200 text-sm font-semibold">
                                Notifications
                            </span>
                            <button
                                onClick={clearNotifications}
                                className="text-gray-500 hover:text-red-500">
                                <XCircle className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="max-h-64 overflow-auto scrollbar-hide">
                            {localNotifications.length > 0 ? (
                                localNotifications.map((notif, index) => (
                                    <div
                                        key={index}
                                        onClick={() =>
                                            handleNotificationClick(index)
                                        }
                                        className="flex items-center text-sm text-gray-800 dark:text-gray-200 mb-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                        {notif.isRead ? (
                                            <MailOpen className="h-7 w-7 text-green-500 mr-2" />
                                        ) : (
                                            <Mail className="h-7 w-7 text-gray-500 mr-2" />
                                        )}
                                        {notif.message}
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
                                    No notifications
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationDropdown;
