import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const loggedIn = localStorage.getItem('email'); // Check if user is logged in
    return loggedIn ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
