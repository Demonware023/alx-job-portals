// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import Profile from './pages/Profile';
import AppliedJobs from './pages/AppliedJobs';
import PostJob from './pages/PostJob';
import MyJobs from './pages/MyJobs';
import Applications from './pages/Applications';
import RecommendedJobs from './components/RecommendedJobs';
import PrivateRoute from './components/PrivateRoute'; // To protect routes
import JobDetails from './pages/JobDetails';
import AuthProvider from './context/AuthContext';
import JobProvider from './context/JobContext';
import CompanyProvider from './context/CompanyContext';
import ApplicationProvider from './context/ApplicationContext';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const App = () => {
    return (
        <Router>
            <Navbar />
            <div className="container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" component={Dashboard} />
                    
                    {/* Protected Routes for Users */}
                    <Route
                        path="/jobs"
                        element={
                            <PrivateRoute>
                                <Jobs />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <PrivateRoute>
                                <Profile />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/applied-jobs"
                        element={
                            <PrivateRoute>
                                <AppliedJobs />
                            </PrivateRoute>
                        }
                    />

                    {/* Protected Routes for Companies */}
                    <Route
                        path="/post-job"
                        element={
                            <PrivateRoute userType="company">
                                <PostJob />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/my-jobs"
                        element={
                            <PrivateRoute userType="company">
                                <MyJobs />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/applications"
                        element={
                            <PrivateRoute userType="company">
                                <Applications />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/jobs/:jobId"
                        element={
                            <PrivateRoute>
                                <JobDetails />
                            </PrivateRoute>
                        }
                    />

                    {/* Add other routes as needed */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
