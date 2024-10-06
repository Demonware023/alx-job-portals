// frontend/src/pages/Jobs.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Jobs = () => {
    const { authToken } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/jobs', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                setJobs(res.data);
            } catch (err) {
                console.error(err.response.data);
                setError(err.response.data.msg || 'Failed to fetch jobs.');
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [authToken]);

    if (loading) {
        return <p>Loading jobs...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="jobs-container">
            <h2>Available Jobs</h2>
            {jobs.length === 0 ? (
                <p>No jobs available at the moment.</p>
            ) : (
                <ul>
                    {jobs.map((job) => (
                        <li key={job._id}>
                            <h3>{job.title}</h3>
                            <p>{job.description}</p>
                            <p><strong>Company:</strong> {job.companyName}</p>
                            <p><strong>Location:</strong> {job.location}</p>
                            <Link to={`/jobs/${job._id}`}>View Details</Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Jobs;
