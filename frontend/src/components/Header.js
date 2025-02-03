import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Link as MuiLink } from '@mui/material';

function Header(props) {
    const navigate = useNavigate();

    function logMeOut() {
        axios({
            method: "POST",
            url: "http://127.0.0.1:5000/logout",
        })
        .then((response) => {
            props.token();
            localStorage.removeItem('email');
            navigate("/login");
        }).catch((error) => {
            if (error.response) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        });
    }

    const logged = localStorage.getItem('email');

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    ABEDY
                </Typography>
                <MuiLink color="inherit" href="/infra" sx={{ marginRight: 2 }}>
                    Inventory
                </MuiLink>                
                <MuiLink color="inherit" href="/admin-dashboard" sx={{ marginRight: 2 }}>
                    Management
                </MuiLink>
                <MuiLink color="inherit" href="/dashboard" sx={{ marginRight: 2 }}>
                    Users
                </MuiLink>
                {!logged ? (
                    <Button 
                        color="inherit" 
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </Button>
                ) : (
                    <Button color="inherit" onClick={logMeOut}>
                        Logout
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Header;
