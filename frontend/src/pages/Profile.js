// frontend/src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { authToken, user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        skills: '',
        experience: '',
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user && user.profile) {
            setFormData({
                skills: user.profile.skills.join(', '),
                experience: user.profile.experience || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(
                `http://localhost:5000/api/users/${user._id}/profile`,
                {
                    skills: formData.skills.split(',').map(skill => skill.trim()),
                    experience: formData.experience,
                },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );
            setUser(res.data);
            setMessage('Profile updated successfully!');
        } catch (err) {
            console.error(err.response.data);
            setMessage(err.response.data.msg || 'Failed to update profile.');
        }
    };

    return (
        <div className="profile-container">
            <h2>Your Profile</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Skills (comma separated):</label>
                    <input
                        type="text"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Experience:</label>
                    <textarea
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
};

export default Profile;
