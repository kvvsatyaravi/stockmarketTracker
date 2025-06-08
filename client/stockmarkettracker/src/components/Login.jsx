import React, { useState, useContext } from "react";
import { Modal, Input, Checkbox, Button, Typography, Form } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { Exchanges } from "./commonUtils";

const { Title, Text, Link } = Typography;

const LoginModal = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  const [setIsLoggedIn] = useContext(Exchanges);

  const handleFinish = (values) => {
    const { email, password } = values;

    // Replace this with your real auth logic
    if (email === "ravi" && password === "ravi") {
      document.cookie = "userID=1;";
      setIsLoggedIn(true);
    } else {
      alert("Invalid credentials");
      setIsLoggedIn(false);
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      footer={null}
      centered
      width={400}
    >
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          Login
        </Title>
      </div>

      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="user"
          label="User Name"
          rules={[{ required: true, message: "Please enter your userName" }]}
        >
          <Input placeholder="Username" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Link href="#">Forgot password</Link>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Sign up
          </Button>
        </Form.Item>

        <div style={{ textAlign: "center" }}>
          <Text>Don’t have an account? </Text>
          <Link href="#">Sign up</Link>
        </div>
      </Form>
    </Modal>
  );
};

export default LoginModal;
