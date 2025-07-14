import React, { useState, useRef, useContext, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button, Card, Modal, Typography, Input, Form } from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import { Exchanges,getCookieValue } from "./commonUtils";
import { showToast } from "./commonUtils";
import parse from "html-react-parser";

const QuillEditor = () => {
  const [form] = Form.useForm();
  const { isLoggedIn,userId } = useContext(Exchanges);
  const [content, setContent] = useState("");
  const [topicsData, setTopicsData] = useState([]);
  const [toggle, setToggle] = useState("");
  const [selCard, setSelCard] = useState({
    title: "",
    content: "",
  });
  

  const quillRef = useRef(null);
  const { Title } = Typography;

  const getAllTopics = () => {
    fetch(
      "https://www.stockmarkettracker.ksrk3.in/stockmarketTrackerApi/getTopics/"
    )
      .then((e) => e.json())
      .then((e) => {
        setTopicsData([...e.data]);
      });
  };

  useEffect(() => {
    if (isLoggedIn) {
      getAllTopics();
    }
  }, [isLoggedIn]);

  const handleSave = (e) => {
    const html = quillRef.current?.getEditor().root.innerHTML;

    const body = {
      htmlcontent: html,
      title: e.title,
      userID: userId,
    };
    if (html != "<p><br></p>") {
      fetch(
        "https://www.stockmarkettracker.ksrk3.in/stockmarketTrackerApi/setTopics/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((responseData) => {
          console.log("Success:", responseData);
          getAllTopics();
          showToast("Successfully added in topics database");
        setToggle("");
        })
        .catch((error) => {
          console.error("Error:", error);
          showToast("Some error there in serverside", "error");
        });
    } else {
      alert("body should not be empty");
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {isLoggedIn ? (
        <>
          <Modal
            width={800}
            onCancel={() => setToggle("")}
            footer={null}
            open={toggle == "topic"}
            title={<Title level={5}>Add Topic</Title>}
          >
            <Form form={form} onFinish={(e) => handleSave(e)} layout="vertical">
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: "Please write title" }]}
              >
                <Input
                  type="text"
                  className="col-3"
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item label="Body">
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  className="mb-4"
                  style={{ height: "200px" }}
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                className="rounded hover:bg-green-700 mt-2"
              >
                Submit Data
              </Button>
            </Form>
          </Modal>

          <div className="justify-content-center text-aligin-center d-flex mb-2">
            <Button type="primary" onClick={() => setToggle("topic")}>
              Add Topics
            </Button>
          </div>

          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
              height: "75vh",
              overflow: "auto",
            }}

            className="custom-card-container"
          >
            {topicsData.length
              ? topicsData.map((each) => {
                  return (
                    <>
                      <Card
                        style={{
                          width: "245px",
                          height: "230px",
                          cursor: "pointer",
                        }}
                        actions={[
                          <EditOutlined
                            style={{ color: "blue" }}
                            onClick={() => alert("Functionality Not Completed")}
                          />,
                          <DeleteFilled
                            style={{ color: "red" }}
                            onClick={() => {
                              setToggle("delete");
                            }}
                            tabIndex={each.id}
                          />,
                        ]}
                      >
                        <Card.Meta
                          onClick={() => {
                            setToggle("viewCard");
                            setSelCard(each);
                          }}
                          title={each.title}
                          description={parse(each.content)}
                        />
                      </Card>
                    </>
                  );
                })
              : "No Data Found"}
          </div>
        </>
      ) : (
        <div
          className="d-flex justify-content-center "
          style={{ flexDirection: "column", alignItems: "center" }}
        >
          <img src={require("../Loginui.jpg")} height={500} width={500} />
          <h4>Login is required</h4>
        </div>
      )}

      {
        <Modal
          open={toggle == "viewCard"}
          onCancel={() => setToggle("")}
          footer={null}
          title={<Title level={5}>{selCard.title}</Title>}
        >
          {parse(selCard.content)}
        </Modal>
      }

      {
        <Modal
          open={toggle == "delete"}
          onCancel={() => setToggle("")}
          footer={null}
          title={<Title level={5}>Delete Topic</Title>}
        >
          <h6>Are you sure want to delete ?</h6>
          <div className="d-flex justify-content-center gap-2 mt-3">
            <Button
              className="col-2"
              type="primary"
              style={{ background: "#091A52" }}
              onClick={(e) => {
                var body = {
                  id: 1,
                };

                fetch(
                  "https://www.stockmarkettracker.ksrk3.in/stockmarketTrackerApi/deleteTopics/",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                  }
                )
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                  })
                  .then((e) => {
                    console.log("toast succesfull");
                    getAllTopics();
                    showToast("Successfully deleted record");
                    setToggle("");
                  })
                  .catch((e) => {
                    setToggle("");
                    console.log("toast rejected");
                    showToast("Some error there in serverside", "error");
                  });
              }}
            >
              Yes
            </Button>
            <Button
              className="col-2"
              onClick={() => setToggle(false)}
              style={{ background: "#ff924c", color: "white", border: "none" }}
            >
              No
            </Button>
          </div>
        </Modal>
      }
    </div>
  );
};

export default QuillEditor;
