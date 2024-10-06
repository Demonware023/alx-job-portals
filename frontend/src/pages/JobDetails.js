// frontend/src/pages/JobDetails.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';

const JobDetails = () => {
    const { jobId } = useParams();
    const { authToken, user } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/jobs/${jobId}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                setJob(res.data);
            } catch (err) {
                console.error(err.response.data);
                setError(err.response.data.msg || 'Failed to fetch job details.');
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [authToken, jobId]);

    const handleApply = async () => {
        try {
            const res = await axios.post(
                `http://localhost:5000/api/jobs/${jobId}/apply`,
                {}, // Add any additional data like cover letter or resume
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );
            setMessage('Application submitted successfully!');
            // Optionally, navigate to Applied Jobs page
            // navigate('/applied-jobs');
        } catch (err) {
            console.error(err.response.data);
            setMessage(err.response.data.msg || 'Failed to apply for the job.');
        }
    };

    if (loading) {
        return <p>Loading job details...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="job-details-container">
            <h2>{job.title}</h2>
            <p>{job.description}</p>
            <p><strong>Company:</strong> {job.companyName}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Skills Required:</strong> {job.skillsRequired.join(', ')}</p>
            {message && <p>{message}</p>}
            {user.type === 'user' && (
                <button onClick={handleApply}>Apply for this Job</button>
            )}
        </div>
    );
};

export default JobDetails;
