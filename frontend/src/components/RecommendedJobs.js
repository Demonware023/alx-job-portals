// frontend/src/components/RecommendedJobs.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const RecommendedJobs = () => {
    const { authToken, user } = useAuth();
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRecommendedJobs = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/jobs/recommendations', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                setRecommendedJobs(res.data);
            } catch (err) {
                console.error(err.response.data);
                setError(err.response.data.msg || 'Failed to fetch recommended jobs.');
            } finally {
                setLoading(false);
            }
        };

        if (user && user.profile.skills.length > 0) {
            fetchRecommendedJobs();
        } else {
            setLoading(false);
        }
    }, [authToken, user]);

    if (loading) {
        return <p>Loading recommended jobs...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="recommended-jobs">
            <h3>Recommended Jobs</h3>
            {recommendedJobs.length === 0 ? (
                <p>No recommendations available. Please add skills to your profile.</p>
            ) : (
                <ul>
                    {recommendedJobs.map((job) => (
                        <li key={job._id}>
                            <h4>{job.title}</h4>
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

export default RecommendedJobs;
