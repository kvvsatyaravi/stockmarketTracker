import React, { useState, useContext } from "react";
import { Modal, Input, Checkbox, Button, Typography, Form } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { Exchanges, showToast } from "./commonUtils";
import { ToastContainer } from "react-toastify";

const { Title, Text, Link } = Typography;

const SignUpModel = ({ visible, setSignUpModelToggle }) => {
  const [form] = Form.useForm();
  const { setIsLoggedIn } = useContext(Exchanges);

  const handleFinish = async (values) => {
    try {
      const { user, password } = values;
      var body = {
        username: user,
        password: password,
      };
      var response = await fetch(
        "https://www.stockmarkettracker.ksrk3.in/stockmarketTrackerApi/addUserAccount/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      response = await response.json();
      // Replace this with your real auth logic
      if (response.response) {
        // setIsLoggedIn(true);
        showToast("Successfully registered user");
      } else {
        showToast(
          "Already user exists please enter differnt user name",
          "error"
        );
        // setIsLoggedIn(false);
      }
    } catch (err) {
      alert("something went wrong in api");
    }
  };

  return (
    <Modal
      visible={visible}
      footer={null}
      centered
      width={400}
      onCancel={(e) => setSignUpModelToggle(false)}
    >
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          Sign Up
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

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Sign up
          </Button>
        </Form.Item>
      </Form>
      <ToastContainer />
    </Modal>
  );
};

export default SignUpModel;
