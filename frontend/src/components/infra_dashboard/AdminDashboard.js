import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Modal, Input, Select, Form } from "antd";
import { useNavigate } from "react-router-dom";

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

  //Fetch users
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

  // Fetch devices
  useEffect(() => {
    fetchDevices();
    fetchLocations();
  }, []);

  const fetchDevices = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/devices/summaries");
      setDevices(res.data);
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/locations");
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      if (editingDevice) {
        // Update an existing device
        await axios.put(`http://localhost:5000/api/device/${editingDevice.id}`, values, config);
      } else {
        // Create a new device
        await axios.post("http://localhost:5000/api/device", values, config);
      }
      fetchDevices();
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error saving device:", error);
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
      fetchDevices();
    } catch (error) {
      console.error("Error deleting device:", error);
    }
  };

  return (
    <div>
      <h2>Admin Device Management</h2>
      
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
    </div>
  );
};

export default AdminDashboard;
