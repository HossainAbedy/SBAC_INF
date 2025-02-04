import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Modal, Input, Select, Form } from "antd";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';  // Import Toastify
import 'react-toastify/dist/ReactToastify.css';  // Import Toastify styles
import { debounce } from "lodash";  // Debounce for search input

const { Option } = Select;

const AdminDashboard = () => {
  const [devices, setDevices] = useState([]);
  const [locations, setLocations] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loggedInUserRole, setLoggedInUserRole] = useState("");
  const [selectedRoles, setSelectedRoles] = useState({});
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    name: '',
    type: '',
    location: ''
  });

  // Fetch users and roles
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

  // Fetch devices based on filters
  const fetchDevices = async () => {
    try {
      console.log("Fetching devices with filters:", filters);  // Debug log for filters
      const res = await axios.get("http://localhost:5000/api/devices/summaries", {
        params: filters  // Apply filters to the API call
      });
      console.log("Fetched devices:", res.data);  // Debug log for API response
      setDevices(res.data);
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  // Fetch locations
  const fetchLocations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/locations");
      setLocations(res.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  useEffect(() => {
    fetchLocations();
    fetchDevices();  // Fetch devices when filters change
  }, [filters]);  // Depend on the filters object

  // Handle Add/Edit Device
  const handleFormSubmit = async (values) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (editingDevice) {
        // Update an existing device
        await axios.put(`http://localhost:5000/api/device/${editingDevice.id}`, values, config);
        toast.success("Device updated successfully!");  // Toastify success
      } else {
        // Create a new device
        await axios.post("http://localhost:5000/api/device", values, config);
        toast.success("Device added successfully!");  // Toastify success
      }

      fetchDevices();
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error saving device:", error);
      toast.error("Error saving device!");  // Toastify error
    }
  };

  // Handle Delete Device
  const handleDelete = async (deviceId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(`http://localhost:5000/api/device/${deviceId}`, config);
      toast.success("Device deleted successfully!");  // Toastify success
      fetchDevices();
    } catch (error) {
      console.error("Error deleting device:", error);
      toast.error("Error deleting device!");  // Toastify error
    }
  };

  // Filter Change Handler with Debounce
  const handleFilterChange = (value, key) => {
    console.log(`Changing filter: ${key} to ${value}`);  // Debug log for filter changes
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: value
    }));
  };

  // Debounced Filter for Search Input (name)
  const debouncedHandleFilterChange = debounce((value, key) => {
    handleFilterChange(value, key);
  }, 500);  // 500ms debounce delay

  return (
    <div>
      <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>Device Management</h2>
      
      {/* Disable buttons for users with the role 'user' */}
      <Button 
        type="primary" 
        onClick={() => setModalVisible(true)} 
        disabled={loggedInUserRole === "user"}
      >
        Add Device
      </Button>

      <Button 
        type="default" 
        onClick={() => navigate("/location-manager")} 
        style={{ marginLeft: 10 }} 
        disabled={loggedInUserRole === "user"}
      >
        Manage Locations
      </Button>

      {/* Device Filter */}
      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <Input 
          placeholder="Search by Name" 
          value={filters.name} 
          onChange={e => debouncedHandleFilterChange(e.target.value, "name")}  // Use debounced filter
          style={{ width: 200, marginRight: 10 }}
        />
        <Select 
          placeholder="Filter by Type" 
          value={filters.type} 
          onChange={value => handleFilterChange(value, "type")} 
          style={{ width: 200, marginRight: 10 }}
        >
          {[...new Set(devices.map(device => device.type))].map((type, index) => (
            <Option key={index} value={type}>{type}</Option>
          ))}
        </Select>

        <Select 
          placeholder="Filter by Location" 
          value={filters.location} 
          onChange={value => handleFilterChange(value, "location")} 
          style={{ width: 200 }}
        >
          {locations.map((loc) => (
            <Option key={loc.id} value={loc.id}>{loc.name}</Option>
          ))}
        </Select>
      </div>

      <Table dataSource={devices} rowKey="id" style={{ marginTop: 20 }}>
        <Table.Column title="Name" dataIndex="name" key="name" />
        <Table.Column title="Type" dataIndex="type" key="type" />
        <Table.Column title="Location" dataIndex="location" key="location" />
        <Table.Column
          title="Actions"
          key="actions"
          render={(text, record) => (
            <>
              <Button 
                onClick={() => {
                  setEditingDevice(record);
                  setModalVisible(true);
                  form.setFieldsValue(record);
                }}
                disabled={loggedInUserRole === "user"} // Disable Edit button for 'user'
              >
                Edit
              </Button>

              <Button 
                danger 
                onClick={() => handleDelete(record.id)} 
                disabled={loggedInUserRole === "user"} // Disable Delete button for 'user'
              >
                Delete
              </Button>
            </>
          )}
        />
      </Table>

      {/* Modal for Add/Edit Device */}
      <Modal
        title={editingDevice ? "Edit Device" : "Add Device"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingDevice(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item name="name" label="Device Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select>
              {[...new Set(devices.map(device => device.type))].map((type, index) => (
                <Option key={index} value={type}>{type}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="location_id" label="Location" rules={[{ required: true }]}>
            <Select>
              {locations.map((loc) => (
                <Option key={loc.id} value={loc.id}>{loc.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="oem" label="OEM (Manufacturer)" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="serial_number" label="Serial Number" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="firmware_version" label="Firmware Version">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <ToastContainer /> {/* Toast container for notifications */}
    </div>
  );
};

export default AdminDashboard;
