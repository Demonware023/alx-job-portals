// frontend/src/components/Login.js

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Assuming you have an AuthContext for managing authentication

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const history = useHistory();
    const { login } = useAuth(); // Use AuthContext to manage login status

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/login', { email, password });

            // If login is successful, save token or login the user
            if (response.data.token) {
                login(response.data.token); // Update context or localStorage
                history.push('/dashboard'); // Redirect to dashboard after login
            }
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
