import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { JobProvider } from './context/JobContext';
import { CompanyProvider } from './context/CompanyContext';
import { ApplicationProvider } from './context/ApplicationContext';
import { NotificationProvider } from './context/NotificationContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ThemeProvider>
        <AuthProvider>
            <JobProvider>
                <CompanyProvider>
                    <ApplicationProvider>
                        <NotificationProvider>
                            <App />
                        </NotificationProvider>
                    </ApplicationProvider>
                </CompanyProvider>
            </JobProvider>
        </AuthProvider>
    </ThemeProvider>
);
