import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Modal, Input, Form } from "antd";
import { useNavigate } from "react-router-dom";

const LocationManager = () => {
  const [locations, setLocations] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/locations");
      setLocations(res.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingLocation) {
        await axios.put(`http://localhost:5000/api/locations/${editingLocation.id}`, values, config);
      } else {
        await axios.post("http://localhost:5000/api/locations", values, config);
      }

      fetchLocations();
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error saving location:", error);
    }
  };

  const handleDelete = async (locationId) => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.delete(`http://localhost:5000/api/locations/${locationId}`, config);
      fetchLocations();
    } catch (error) {
      console.error("Error deleting location:", error);
    }
  };

  return (
    <div>
      <h2>Location Management</h2>
      <Button type="primary" onClick={() => setModalVisible(true)}>Add Location</Button>
      <Button onClick={() => navigate(-1)} style={{ marginLeft: 10 }}>Back</Button>

      <Table dataSource={locations} rowKey="id" style={{ marginTop: 20 }}>
        <Table.Column title="Location Name" dataIndex="name" key="name" />
        <Table.Column title="Location Code" dataIndex="sub_branch_code" key="sub_branch_code" />
        <Table.Column
          title="Actions"
          key="actions"
          render={(text, record) => (
            <>
              <Button onClick={() => { setEditingLocation(record); setModalVisible(true); form.setFieldsValue(record); }}>Edit</Button>
              <Button danger onClick={() => handleDelete(record.id)}>Delete</Button>
            </>
          )}
        />
      </Table>

      <Modal
        title={editingLocation ? "Edit Location" : "Add Location"}
        open={modalVisible}
        onCancel={() => { setModalVisible(false); setEditingLocation(null); form.resetFields(); }}
        onOk={() => form.submit()}
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
    </div>
  );
};

export default LocationManager;
