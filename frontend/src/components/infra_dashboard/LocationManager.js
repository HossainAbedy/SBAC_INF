import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Modal, Input, Form } from "antd";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";  // Import Toastify components
import 'react-toastify/dist/ReactToastify.css';  // Import the CSS for styling
import { SearchOutlined } from "@ant-design/icons"; // For Search Icon

const LocationManager = () => {
    const [locations, setLocations] = useState([]);
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingLocation, setEditingLocation] = useState(null);
    const [form] = Form.useForm();
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
  
    useEffect(() => {
      fetchLocations();
    }, []);
  
    useEffect(() => {
      filterLocations();
    }, [searchTerm, locations]);
  
    const fetchLocations = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/locations");
        setLocations(res.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
        toast.error("Error fetching locations!");
      }
    };
  
    const filterLocations = () => {
      if (!searchTerm) {
        setFilteredLocations(locations);
      } else {
        setFilteredLocations(
          locations.filter(
            (location) =>
              location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              location.sub_branch_code.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }
    };
  
    const handleFormSubmit = async (values) => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
  
        if (editingLocation) {
          await axios.put(`http://localhost:5000/api/locations/${editingLocation.id}`, values, config);
          toast.success("Location updated successfully!");
        } else {
          await axios.post("http://localhost:5000/api/locations", values, config);
          toast.success("Location added successfully!");
        }
  
        fetchLocations();
        setModalVisible(false);
        form.resetFields();
      } catch (error) {
        console.error("Error saving location:", error);
        toast.error("Error saving location!");
      }
    };
  
    const handleDelete = async (locationId) => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
  
        await axios.delete(`http://localhost:5000/api/locations/${locationId}`, config);
        toast.success("Location deleted successfully!");
        fetchLocations();
      } catch (error) {
        console.error("Error deleting location:", error);
        toast.error("Error deleting location!");
      }
    };
  
    return (
      <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>Location Management</h2>
  
        {/* <div style={{ marginBottom: "2px", display: "flex", justifyContent: "space-between", gap: "2px" }}> */}
          <Button type="primary" onClick={() => setModalVisible(true)} style={{ backgroundColor: "#4CAF50" }}>
            Add Location
          </Button>
          <Button 
            type="default" 
            onClick={() => navigate("/admin-dashboard")} 
            style={{ marginLeft: 10 }} 
            // disabled={loggedInUserRole === "user"}
            >
                Manage Users
          </Button>
          <Input
            placeholder="Search by Location Name or Code"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300,marginLeft: 10 }}
            prefix={<SearchOutlined />}
          />
        {/* </div> */}
  
        <Table
          dataSource={filteredLocations}
          rowKey="id"
          style={{ marginTop: 20 }}
          pagination={{ pageSize: 10 }}
          bordered
        >
          <Table.Column title="Location Name" dataIndex="name" key="name" />
          <Table.Column title="Location Code" dataIndex="sub_branch_code" key="sub_branch_code" />
          <Table.Column
            title="Actions"
            key="actions"
            render={(text, record) => (
              <>
                <Button
                  type="link"
                  onClick={() => {
                    setEditingLocation(record);
                    setModalVisible(true);
                    form.setFieldsValue(record);
                  }}
                  style={{ marginRight: 10 }}
                >
                  Edit
                </Button>
                <Button
                  danger
                  onClick={() => handleDelete(record.id)}
                  style={{ marginRight: 10 }}
                >
                  Delete
                </Button>
              </>
            )}
          />
        </Table>
  
        <Modal
          title={editingLocation ? "Edit Location" : "Add Location"}
          open={modalVisible}
          onCancel={() => { setModalVisible(false); setEditingLocation(null); form.resetFields(); }}
          onOk={() => form.submit()}
          okText={editingLocation ? "Save Changes" : "Add Location"}
          cancelText="Cancel"
        >
          <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
            <Form.Item name="name" label="Location Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="sub_branch_code" label="Location Code" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Form>
        </Modal>
  
        {/* Toast container for showing toasts */}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop />
      </div>
    );
  };
  
  export default LocationManager;
  