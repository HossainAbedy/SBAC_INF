import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Header from './components/Header';
import Profile from './components/Profile';
import Register from './components/Register'; // Import the Register component
import useToken from './components/useToken';
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import BranchList from "./components/inventory/BranchList";
import BranchDetails from "./components/inventory/BranchDetails";
import BranchForm from "./components/inventory/BranchForm";
import DeviceList from "./components/inventory/DeviceList";
import DeviceDetails from "./components/inventory/DeviceDetails";
import DeviceForm from "./components/inventory/DeviceForm";
import BranchUserList from "./components/inventory/BranchUserList";
import BranchUserDetails from "./components/inventory/BranchUserDetails";
import BranchUserForm from "./components/inventory/BranchUserForm";
import NetDash from "./components/netdash/NetDash";
import DeviceStatus from "./components/netdash/DeviceStatus";
import BandwidthUsage from "./components/netdash/BandwidthUsage";
import DeviceReport from "./components/netdash/DeviceReport";
import useSocket from "./components/netdash/useSocket";

function App() {
    const { token, removeToken, setToken } = useToken();
    const [deviceId, setDeviceId] = useState(1);

    return (
        <div className="vh-100 gradient-custom">
            <div className="container">
                

                <BrowserRouter>
                    <Header token={removeToken} />
                    <Routes>
                        <Route path="/login" element={<Login setToken={setToken} />} />
                        <Route path="/profile" element={<Profile token={token} setToken={setToken} />} />
                        <Route path="/register" element={<Register />} /> {/* Add the route for /register */}
                        <Route path="/dashboard" element={<Dashboard />} /> {/* Add the route for /dashboard */}
                        <Route path="/branch" element={<BranchList />} />
                        <Route path="/branch/:id" element={<BranchDetails />} />
                        <Route path="/add-branch" element={<BranchForm />} />
                        <Route path="/edit-branch/:id" element={<BranchForm />} />
                        <Route path="/device" element={<DeviceList />} />
                        <Route path="/device/:id" element={<DeviceDetails />} />
                        <Route path="/add-device" element={<DeviceForm />} />
                        <Route path="/edit-device/:id" element={<DeviceForm />} />
                        <Route path="/branch_user" element={<BranchUserList />} />
                        <Route path="/branch_user/:id" element={<BranchUserDetails />} />
                        <Route path="/add-branch_user" element={<BranchUserForm />} />
                        <Route path="/edit-branch_user/:id" element={<BranchUserForm />} />
                        <Route path="/netdash" element={<NetDash />} />
                        <Route path="/device-status" element={<DeviceStatus />} deviceId={deviceId}/>
                        <Route path="/bandwidth-usage" element={<BandwidthUsage />} deviceId={deviceId}/>
                        <Route path="/device-report" element={<DeviceReport />} deviceId={deviceId}/>
                        <Route path="/use-socket" element={<useSocket />} deviceId={deviceId}/>                       
                        <Route 
                            path="/" 
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            } 
                        />
                    </Routes>
                </BrowserRouter>
            </div>
        </div>
    );
}

export default App;
