// frontend/src/context/CompanyContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CompanyContext = createContext();

export const useCompany = () => useContext(CompanyContext);

const CompanyProvider = ({ children }) => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/companies')
            .then((res) => {
                setCompanies(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <CompanyContext.Provider value={{ companies, loading }}>
            {children}
        </CompanyContext.Provider>
    );
};

export default CompanyProvider;
