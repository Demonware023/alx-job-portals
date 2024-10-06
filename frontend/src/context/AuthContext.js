// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create the context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Function to log in
    const login = (token) => {
        localStorage.setItem('token', token);
        setAuthToken(token);
    };

    // Function to log out
    const logout = () => {
        localStorage.removeItem('token');
        setAuthToken(null);
        setUser(null);
    };

    // Fetch the authenticated user's data
    const fetchUser = async () => {
        if (authToken) {
            try {
                const res = await axios.get('http://localhost:5000/api/auth/me', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                setUser(res.data);
            } catch (err) {
                console.error(err);
                logout();
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUser();
        // eslint-disable-next-line
    }, [authToken]);

    return (
        <AuthContext.Provider value={{ authToken, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};
