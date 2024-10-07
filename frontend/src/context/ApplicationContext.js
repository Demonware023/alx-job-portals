// frontend/src/context/ApplicationContext.js

import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const ApplicationContext = createContext();

export const useApplication = () => useContext(ApplicationContext);

const ApplicationProvider = ({ children }) => {
    const [applications, setApplications] = useState([]);

    const applyForJob = async (jobId, userId) => {
        try {
            const res = await axios.post(`/api/jobs/${jobId}/apply`, { userId });
            setApplications([...applications, res.data]);
        } catch (err) {
            console.error('Error applying for job:', err);
        }
    };

    return (
        <ApplicationContext.Provider value={{ applications, applyForJob }}>
            {children}
        </ApplicationContext.Provider>
    );
};

export default ApplicationProvider;
