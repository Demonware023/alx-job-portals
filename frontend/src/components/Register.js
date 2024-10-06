// frontend/src/components/Register.js

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Assuming you have an AuthContext for managing authentication

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const history = useHistory();
    const { login } = useAuth(); // Use AuthContext to manage login status

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic password validation
        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        try {
            // Send POST request to the backend for registration
            const response = await axios.post('/api/auth/register', {
                name,
                email,
                password,
            });

            // If registration is successful, log the user in and redirect
            if (response.data.token) {
                login(response.data.token); // Update context or localStorage
                history.push('/dashboard'); // Redirect to dashboard
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
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
                <div className="form-group">
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
