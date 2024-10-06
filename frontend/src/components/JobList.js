// frontend/src/components/JobList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get('/api/jobs'); // Adjust the API endpoint as needed
                setJobs(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (loading) {
        return <p>Loading jobs...</p>;
    }

    if (error) {
        return <p>Error fetching jobs: {error}</p>;
    }

    return (
        <div className="job-list">
            <h2>Job Listings</h2>
            <ul>
                {jobs.map(job => (
                    <li key={job._id} className="job-item">
                        <h3>{job.title}</h3>
                        <p>{job.description}</p>
                        <p><strong>Company:</strong> {job.company.name}</p>
                        <Link to={`/jobs/${job._id}`} className="btn btn-primary">View Details</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default JobList;
