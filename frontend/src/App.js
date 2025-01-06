import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Header from './components/Header';
import Profile from './components/Profile';
import Register from './components/Register'; // Import the Register component
import useToken from './components/useToken';
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";

function App() {
    const { token, removeToken, setToken } = useToken();

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
