import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Card, Stack, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, TextField, FormControl} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add, Delete, Person, Save } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserDashboard() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loggedInUserRole, setLoggedInUserRole] = useState("");
    const [selectedRoles, setSelectedRoles] = useState({});
    const [newUser, setNewUser] = useState({ username: "", email: "", password: "", roleId: "" });
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
        axios.get("http://172.19.100.110:5000/roles")
            .then(response => setRoles(response.data.roles))
            .catch(error => toast.error("Error fetching roles"));
    }, []);

    const fetchUsers = () => {
        axios.get("http://172.19.100.110:5000/users", {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        })
        .then(response => {
            setUsers(response.data.users);
            setLoggedInUserRole(response.data.loggedInUserRole);
        })
        .catch(() => toast.error("Error fetching users"));
    };

    const handleRoleChange = (userId, newRoleId) => {
        setSelectedRoles(prev => ({ ...prev, [userId]: newRoleId }));
    };

    const updateUserRole = (userId, newRoleId) => {
        axios.post(`http://172.19.100.110:5000/users/${userId}/updateRole`, { roleId: newRoleId }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        })
        .then(() => {
            toast.success("Role updated successfully!");
            setUsers(users.map(user => user.id === userId ? { ...user, roleId: newRoleId } : user));
        })
        .catch(error => toast.error(error.response?.data?.message || "Error updating role"));
    };

    const handleDeleteUser = (userId) => {
        axios.delete(`http://172.19.100.110:5000/user/${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        })
        .then(() => {
            toast.success("User deleted successfully");
            setUsers(users.filter(user => user.id !== userId));
        })
        .catch(() => toast.error("Error deleting user"));
    };

    const handleAddUser = () => {
        axios.post("http://172.19.100.110:5000/register", newUser, {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        })
        .then(() => {
            toast.success("User added successfully!");
            fetchUsers();
            setOpen(false);
        })
        .catch(() => toast.error("Error adding user"));
    };

    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "username", headerName: "Name", flex: 1 },
        { field: "email", headerName: "Email", flex: 1 },
        { 
            field: "roleId", 
            headerName: "Role", 
            flex: 1,
            renderCell: (params) => (
                <FormControl fullWidth size="small" disabled={loggedInUserRole !== "admin"}>
                    <Select 
                        value={selectedRoles[params.row.id] || params.row.roleId} 
                        onChange={e => handleRoleChange(params.row.id, parseInt(e.target.value))}
                    >
                        {roles.map(role => <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>)}
                    </Select>
                </FormControl>
            )
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        size="small" 
                        startIcon={<Save />} 
                        onClick={() => updateUserRole(params.row.id, selectedRoles[params.row.id] || params.row.roleId)}
                        disabled={loggedInUserRole !== "admin"}
                    >
                        Save
                    </Button>
                    <Button 
                        variant="contained" 
                        color="error" 
                        size="small" 
                        startIcon={<Delete />} 
                        onClick={() => handleDeleteUser(params.row.id)}
                        disabled={loggedInUserRole === "user"}
                    >
                        Delete
                    </Button>
                </Stack>
            )
        }
    ];

    return (
        <Box sx={{ padding: 3 }}>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

            <Stack direction="row" justifyContent="space-between" alignItems="center" marginBottom={3}>
                <Typography variant="h4">User Dashboard</Typography>
                <Button variant="contained" color="info" startIcon={<Person />} onClick={() => navigate("/profile")}>
                    Go to Profile
                </Button>
            </Stack>

            <Card elevation={3} sx={{ padding: 3 }}>
                <Stack direction="row" justifyContent="flex-end">
                    <Button 
                        variant="contained" 
                        color="primary" 
                        startIcon={<Add />} 
                        onClick={() => setOpen(true)}
                        disabled={loggedInUserRole === "user"}
                    >
                        Add User
                    </Button>
                </Stack>

                <Box sx={{ height: 400, marginTop: 2 }}>
                    <DataGrid 
                        rows={users} 
                        columns={columns} 
                        pageSize={5} 
                        getRowId={(row) => row.id} 
                        disableSelectionOnClick 
                    />
                </Box>
            </Card>

            {/* Add User Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add New User</DialogTitle>
                <DialogContent>
                    <TextField label="Username" fullWidth value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} margin="dense" />
                    <TextField label="Email" fullWidth value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} margin="dense" />
                    <TextField label="Password" fullWidth type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} margin="dense" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddUser} color="primary">Add</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default UserDashboard;
