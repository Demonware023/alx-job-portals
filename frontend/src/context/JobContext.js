// frontend/src/context/JobContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const JobContext = createContext();

export const useJob = () => useContext(JobContext);

const JobProvider = ({ children }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/jobs')
            .then((res) => {
                setJobs(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <JobContext.Provider value={{ jobs, loading }}>
            {children}
        </JobContext.Provider>
    );
};

export default JobProvider;
