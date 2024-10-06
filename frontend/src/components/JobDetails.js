// frontend/src/components/JobDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const JobDetails = () => {
    const { jobId } = useParams(); // Get jobId from URL parameters
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/jobs/${jobId}`);
                setJob(res.data);
            } catch (err) {
                setError(err.response ? err.response.data : 'Error fetching job details');
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [jobId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="job-details">
            <h2>{job.title}</h2>
            <p><strong>Company:</strong> {job.companyName}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Description:</strong> {job.description}</p>
            <p><strong>Requirements:</strong> {job.requirements}</p>
            <p><strong>Salary:</strong> {job.salary}</p>
            <button onClick={() => alert('Apply functionality to be implemented')}>Apply</button>
        </div>
    );
};

export default JobDetails;

