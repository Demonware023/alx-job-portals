// frontend/src/pages/AppliedJobs.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AppliedJobs = () => {
    const { authToken, user } = useAuth();
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/users/${user._id}/applied-jobs`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                setAppliedJobs(res.data);
            } catch (err) {
                console.error(err.response.data);
                setError(err.response.data.msg || 'Failed to fetch applied jobs.');
            } finally {
                setLoading(false);
            }
        };

        fetchAppliedJobs();
    }, [authToken, user._id]);

    if (loading) {
        return <p>Loading applied jobs...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="applied-jobs-container">
            <h2>Your Applied Jobs</h2>
            {appliedJobs.length === 0 ? (
                <p>You have not applied for any jobs yet.</p>
            ) : (
                <ul>
                    {appliedJobs.map((job) => (
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

export default AppliedJobs;
