import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css';

import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import UserDashboard from './components/UserDashboard';
import PrivateRoute from './components/PrivateRoute';
import useToken from './components/useToken';

import InfraDashboard from './components/infra_dashboard/InfraDashboard';
import DeviceList from './components/infra_dashboard/DeviceList';
import DeviceDetails from './components/infra_dashboard/DeviceDetails';
import AdminDashboard from './components/infra_dashboard/AdminDashboard';
import LocationManager from './components/infra_dashboard/LocationManager';

function App() {
    const { token, removeToken, setToken } = useToken();
    const [selectedType, setSelectedType] = useState(null);
    const [selectedDevice, setSelectedDevice] = useState(null);

    return (
        <BrowserRouter>
            <div className="vh-100 gradient-custom">
                <Header token={removeToken} />
                
                <div className="container">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<Login setToken={setToken} />} />
                        <Route path="/register" element={<Register />} />

                        {/* Protected Routes (Only Accessible When Logged In) */}
                        <Route 
                            path="/*" 
                            element={
                                <PrivateRoute>
                                    <Routes>
                                        {/* <Route path="/" element={<Dashboard />} /> */}
                                        <Route path="/profile" element={<Profile token={token} setToken={setToken} />} />
                                        <Route path="/dashboard" element={<UserDashboard />} />
                                        <Route path="/admin-dashboard" element={<AdminDashboard />} />
                                        <Route path="/location-manager" element={<LocationManager />} />
                                        
                                        {/* All routes are protected */}
                                        <Route path="/" element={<PrivateRoute><InfraDashboard onSelectType={setSelectedType} /></PrivateRoute>} />
                                        <Route path="/devices" element={<PrivateRoute><DeviceList selectedType={selectedType} onSelectDevice={setSelectedDevice} /></PrivateRoute>} />
                                        <Route path="/device/:id" element={<PrivateRoute><DeviceDetails deviceId={selectedDevice} /></PrivateRoute>} />
                                        
                                        {/* Redirect to InfraDashboard if no match */}
                                        <Route path="*" element={<Navigate to="/" />} />
                                    </Routes>
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
