import React, { createContext, useContext, useState } from 'react';

// Create the NotificationContext
const NotificationContext = createContext();

// Custom hook to use the NotificationContext
export const useNotification = () => {
    return useContext(NotificationContext);
};

// Provider component
export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    // Add a notification
    const addNotification = (message) => {
        const newNotification = { id: Date.now(), message };
        setNotifications((prev) => [...prev, newNotification]);

        // Automatically remove notification after 5 seconds
        setTimeout(() => {
            removeNotification(newNotification.id);
        }, 5000);
    };

    // Remove a notification
    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                addNotification,
                removeNotification,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};
