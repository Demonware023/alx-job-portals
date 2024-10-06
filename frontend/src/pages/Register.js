// frontend/src/pages/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [isCompany, setIsCompany] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        companyName: '',
        email: '',
        password: '',
    });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = isCompany ? '/company' : '/user';
            const payload = isCompany
                ? {
                      companyName: formData.companyName,
                      email: formData.email,
                      password: formData.password,
                  }
                : {
                      username: formData.username,
                      email: formData.email,
                      password: formData.password,
                  };
            const res = await axios.post(`http://localhost:5000/api/auth/register/${endpoint}`, payload);
            login(res.data.token);
            navigate('/dashboard');
        } catch (err) {
            console.error(err.response.data);
            alert(err.response.data.msg || 'Registration failed');
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        <input
                            type="radio"
                            checked={!isCompany}
                            onChange={() => setIsCompany(false)}
                        />
                        User
                    </label>
                    <label>
                        <input
                            type="radio"
                            checked={isCompany}
                            onChange={() => setIsCompany(true)}
                        />
                        Company
                    </label>
                </div>
                {!isCompany && (
                    <div>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}
                {isCompany && (
                    <div>
                        <input
                            type="text"
                            name="companyName"
                            placeholder="Company Name"
                            value={formData.companyName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}
                <div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
