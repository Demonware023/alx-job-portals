import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the ThemeContext
const ThemeContext = createContext();

// Custom hook to use the ThemeContext
export const useTheme = () => {
    return useContext(ThemeContext);
};

// Provider component
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');

    // Load the theme from local storage or set to 'light' by default
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    // Function to toggle the theme
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme); // Save to local storage
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <div className={theme}>{children}</div> {/* Apply the theme class to children */}
        </ThemeContext.Provider>
    );
};
