// frontend/src/context/AuthContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

// Create the Auth context
const AuthContext = createContext();

// Custom hook to use the Auth context
export const useAuth = () => {
    return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    // Function to check if the user is authenticated
    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        return token ? true : false;
    };

    // Login function
    const login = async (email, password) => {
        try {
            const res = await axios.post('/api/auth/login', { email, password });
            const { token, user } = res.data;

            // Save the token to localStorage
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setUser(user);
            history.push('/dashboard'); // Redirect after login
        } catch (error) {
            console.error('Login failed:', error.response.data);
        }
    };

    // Register function
    const register = async (name, email, password) => {
        try {
            const res = await axios.post('/api/auth/register', { name, email, password });
            const { token, user } = res.data;

            // Save the token to localStorage
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setUser(user);
            history.push('/dashboard'); // Redirect after registration
        } catch (error) {
            console.error('Registration failed:', error.response.data);
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        history.push('/login'); // Redirect to login after logout
    };

    // Fetch current user information
    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const res = await axios.get('/api/auth/me');
                setUser(res.data);
            }
        } catch (error) {
            console.error('Error fetching user data:', error.response.data);
            logout(); // In case of error, log the user out
        } finally {
            setLoading(false);
        }
    };

    // Check if user is logged in and fetch user data on app load
    useEffect(() => {
        fetchUser();
    }, []);

    // Context value
    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children} {/* Ensure content is rendered only when not loading */}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
