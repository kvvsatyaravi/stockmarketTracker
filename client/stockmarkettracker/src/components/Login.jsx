import React, { useState, useContext } from "react";
import { Modal, Input, Checkbox, Button, Typography, Form } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { Exchanges, showToast } from "./commonUtils";
import SignUpModel from "./Signup";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router";

const { Title, Text, Link } = Typography;

const LoginModal = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  const { setIsLoggedIn } = useContext(Exchanges);
  const [signUpModelToggle, setSignUpModelToggle] = useState(false);
  const [loginInModelToggle, setLoginInModelToggle] = useState(true);
  const Navigate = useNavigate();

  const handleFinish = async (values) => {
    try {
      const { user, password } = values;
      var body = {
        username: user,
        password: password,
      };
      var res = await fetch(
        "https://www.stockmarkettracker.ksrk3.in/stockmarketTrackerApi/validateLoginDetails/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      res = await res.json();
      // Replace this with your real auth logic
      if (res.response) {
        var now = new Date();
        var time = now.getTime();
        var expireTime = time + 1000 * 5000;
        now.setTime(expireTime);
        document.cookie =
          "userID=" +
          res.userId[0]["UserID"] +
          ";expires=" +
          now.toUTCString() +
          ";path=/";

        showToast("Successfully signed In");
        setIsLoggedIn(true);
        setLoginInModelToggle(false);
        Navigate("/StocksList");
      } else {
        showToast("Invalid credentials", "error");
        setIsLoggedIn(false);
        setLoginInModelToggle(false);
      }
    } catch (err) {
      showToast("Something went wrong in api", "error");
    }
  };

  return (
    <>
      <Modal
        visible={!signUpModelToggle && loginInModelToggle}
        onCancel={() => {
          setLoginInModelToggle(false);
          setIsLoggedIn(false);
        }}
        afterClose={()=>{
          setIsLoggedIn(false);
        }}
        footer={null}
        centered
        width={400}
      >
        <ToastContainer />
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
            <Link
              onClick={() => {
                showToast("Working on these Functionality", "error");
              }}
            >
              Forgot password
            </Link>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            <Text>Don’t have an account? </Text>
            <div
              style={{ textAlign: "center", cursor: "pointer" }}
              onClick={() => setSignUpModelToggle(!signUpModelToggle)}
            >
              Sign up
            </div>
          </div>
        </Form>
      </Modal>

      <SignUpModel
        visible={signUpModelToggle}
        setSignUpModelToggle={setSignUpModelToggle}
      />
    </>
  );
};

export default LoginModal;
