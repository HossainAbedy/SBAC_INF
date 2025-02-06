import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Modal, Input, Select, Form } from "antd";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { debounce } from "lodash";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

const AdminDashboard = () => {
  const [devices, setDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [locations, setLocations] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [loggedInUserRole, setLoggedInUserRole] = useState("");
  const [filters, setFilters] = useState({
    name: '',
    type: '',
    location: ''
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
        fetchUsers();
        fetchLocations();
        fetchDevices();
    }, []);  // Run only once on mount

  useEffect(() => {
    setFilteredDevices(devices.filter(device => {
        return (
            device.name.toLowerCase().includes(filters.name.toLowerCase()) &&
            device.type.toLowerCase().includes(filters.type.toLowerCase()) &&
            (filters.location ? device.location === filters.location : true) 
        );
    }));
   }, [filters, devices]);  // Only runs when filters or devices change

  // Fetch users
  const fetchUsers = () => {
    axios.get("http://172.19.100.110:5000/users", {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    })
    .then(response => {
      setLoggedInUserRole(response.data.loggedInUserRole);
    })
    .catch(error => console.error("Error fetching users:", error));
  };

  // Fetch devices based on filters
  const fetchDevices = async () => {
    try {
      const res = await axios.get("http://172.19.100.110:5000/api/devices/summaries", {
        params: filters  // Apply filters to the API call
      });
      setDevices(res.data);
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  // Fetch locations
  const fetchLocations = async () => {
    try {
      const res = await axios.get("http://172.19.100.110:5000/api/locations", {
        params: filters  // Apply filters to the API call
      });
      setLocations(res.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  // Handle Add/Edit Device
  const handleFormSubmit = async (values) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found. Please log in.");
      }
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      if (editingDevice) {
        await axios.put(`http://172.19.100.110:5000/api/device/${editingDevice.id}`, values, config);
        toast.success("Device updated successfully!");
      } else {
        await axios.post("http://172.19.100.110:5000/api/device", values, config);
        toast.success("Device added successfully!");
      }
      fetchDevices();
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      toast.error("Error saving device!");
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
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.delete(`http://172.19.100.110:5000/api/device/${deviceId}`, config);
      toast.success("Device deleted successfully!");
      fetchDevices();
    } catch (error) {
      toast.error("Error deleting device!");
    }
  };

  // Handle filter change
  const handleFilterChange = (value, key) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: key === "location" ? value : value // Store location as ID
    }));
  };

  // Debounced search filter
  const debouncedSearchTermChange = debounce((term) => {
    setFilters((prev) => ({
      ...prev,
      name: term
    }));
  }, 500);

  const handleSearchTermChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearchTermChange(value);  // Call debounced function
  };

  return (
    <div>
      <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>Device Management</h2>
      
      <div style={{ marginTop: 20, marginBottom: 20 }}>
      <Button 
        type="primary" 
        onClick={() => setModalVisible(true)} 
        disabled={loggedInUserRole === "user"}
        style={{ backgroundColor: "#4CAF50" }}
      >
        Add Device
      </Button>
      <Button 
        type="primary" 
        onClick={() => navigate("/location-manager")} 
        style={{ marginLeft: 10 }} 
        // disabled={loggedInUserRole === "user"}
      >
                      Manage Location
      </Button>

      {/* Search Inputs */}
      <Input
          placeholder="Search by anything"
          value={searchTerm}
          onChange={handleSearchTermChange}
          style={{ width: 300, marginLeft: 10 }}
          prefix={<SearchOutlined />}
      />

        <Input
          placeholder="Search by Name"
          value={filters.name}
          onChange={e => handleSearchTermChange(e)}
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
                <Option key={loc.id} value={loc.name}>{loc.name}</Option> // Store ID instead of name
            ))}
        </Select>
      </div>

      {/* Device Table */}
      <Table dataSource={filteredDevices} rowKey="id" style={{ marginTop: 20 }}>
        <Table.Column title="Name" dataIndex="name" key="name" />
        <Table.Column title="Type" dataIndex="type" key="type" />
        <Table.Column title="Location" dataIndex="location" key="location" />
        <Table.Column
          title="Actions"
          key="actions"
          render={(text, record) => (
            <>
              <Button
                style={{ 
                    marginRight: 10,
                    // outline: "2px solid yellow", // Add a yellow outline
                    backgroundColor: "#FFD700"
                }}
                onClick={() => {
                    setEditingDevice(record);
                    setModalVisible(true);
                    form.setFieldsValue(record);
                }}
                disabled={loggedInUserRole === "user"}
                >
                Edit
                </Button>
                <Button 
                // danger
                style={{ 
                    marginRight: 10,
                    // outline: "2px solid red", // Add a red outline
                    backgroundColor: "#FF2400"
                }} 
                onClick={() => handleDelete(record.id)} 
                disabled={loggedInUserRole === "user"}
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
                <Option key={loc.id} value={loc.name}>{loc.name}</Option>
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

      <ToastContainer />
    </div>
  );
};

export default AdminDashboard;
