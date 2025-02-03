import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Table, TableHead, TableRow, TableCell, TableBody, Select, MenuItem, TextField, FormControl, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

function UserDashboard() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loggedInUserRole, setLoggedInUserRole] = useState("");
    const [selectedRoles, setSelectedRoles] = useState({});
    const [newUser, setNewUser] = useState({ username: "", email: "", password: "", roleId: "" });
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const fetchUsers = () => {
        axios.get("http://127.0.0.1:5000/users", {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        })
        .then(response => {
            setUsers(response.data.users);
            setLoggedInUserRole(response.data.loggedInUserRole);
        })
        .catch(error => console.error("Error fetching users:", error));
    };

    useEffect(() => {
        fetchUsers();
        axios.get("http://127.0.0.1:5000/roles")
        .then(response => setRoles(response.data.roles))
        .catch(error => console.error("Error fetching roles:", error));
    }, []);

    const handleRoleChange = (userId, newRoleId) => {
        setSelectedRoles(prevState => ({ ...prevState, [userId]: newRoleId }));
    };

    const updateUserRole = (userId, newRoleId) => {
        axios.post(`http://127.0.0.1:5000/users/${userId}/updateRole`, { roleId: newRoleId }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        })
        .then(() => {
            alert("Role updated successfully!");
            setUsers(users.map(user => user.id === userId ? { ...user, roleId: newRoleId } : user));
        })
        .catch(error => alert(error.response?.data?.message || "Error updating role"));
    };

    const handleDeleteUser = (userId) => {
        axios.delete(`http://127.0.0.1:5000/user/${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        })
        .then(() => {
            alert("User deleted successfully");
            setUsers(users.filter(user => user.id !== userId));
        })
        .catch(error => alert("Error deleting user"));
    };

    const handleAddUser = () => {
        axios.post("http://127.0.0.1:5000/register", newUser, {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        })
        .then(() => {
            fetchUsers();  // Fetch updated list after adding a user
            setOpen(false);
        })
        .catch(error => {
            console.error("Error adding user:", error);
            alert("Error adding user");
        });
    };

    return (
        <Box sx={{ padding: 3 }}>
            {/* Aligning Profile button to the right */}
            <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <Typography variant="h4">User Dashboard</Typography>
                <Button variant="contained" color="info" onClick={() => navigate("/profile")}>Go to Profile</Button>
            </Box>

            {/* Disable Add User button if logged-in role is "user" */}
            <Button variant="contained" color="primary" onClick={() => setOpen(true)} disabled={loggedInUserRole === "user"}>
                Add User
            </Button>

            <Table sx={{ marginTop: 2 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map(user => (
                        <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <FormControl fullWidth disabled={loggedInUserRole !== "admin"}>
                                    <Select value={selectedRoles[user.id] || user.roleId} onChange={e => handleRoleChange(user.id, parseInt(e.target.value))}>
                                        {roles.map(role => <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => updateUserRole(user.id, selectedRoles[user.id] || user.roleId)}
                                    disabled={loggedInUserRole !== "admin"}
                                >
                                    Save Role
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleDeleteUser(user.id)}
                                    disabled={loggedInUserRole === "user"}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Add User Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add New User</DialogTitle>
                <DialogContent>
                    <TextField label="Username" fullWidth value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} />
                    <TextField label="Email" fullWidth value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
                    <TextField label="Password" fullWidth type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
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
