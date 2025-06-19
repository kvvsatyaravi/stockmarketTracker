import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button, Card } from "antd";
import { ArrowLeftOutlined, EditOutlined, DeleteFilled } from "@ant-design/icons";
import { each } from "jquery";
import parse from "html-react-parser";

const QuillEditor = () => {
  const [content, setContent] = useState("");
  const [editorToggle, setEditorToggle] = useState(false);
  const quillRef = useRef(null);

  const topicsList = [
    {
      id: 1,
      content: "<h3>testing</h3><br><p>temp</p>",
      title: "test",
    },
    {
      id: 2,
      content: "<h3>testing1</h3><br><p>temp2</p>",
      title: "test 2",
    },
    {
      id: 1,
      content: "<h3>testing</h3><br><p>temp</p>",
      title: "test",
    },
    {
      id: 2,
      content: "<h3>testing1</h3><br><p>temp2</p>",
      title: "test 2",
    },
    {
      id: 1,
      content: "<h3>testing</h3><br><p>temp</p>",
      title: "test",
    },
    {
      id: 2,
      content: "<h3>testing1</h3><br><p>temp2</p>",
      title: "test 2",
    },
  ];

  const handleSave = () => {
    const html = quillRef.current?.getEditor().root.innerHTML;

    const body = {
      htmlcontent: html,
      userId: 1,
    };
    fetch("https://www.stockmarkettracker.ksrk3.in/stockmarketTrackerApi/setTopics/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        console.log("Success:", responseData);
        return responseData;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {editorToggle ? (
        <>
          <ArrowLeftOutlined onClick={() => setEditorToggle(!editorToggle)} className="mb-4" />
          {/* <h2 className="text-xl font-semibold mb-4">Quill HTML Editor</h2> */}
          <ReactQuill ref={quillRef} theme="snow" value={content} onChange={setContent} className="mb-4" style={{ width: "1000px" }} />
          <Button type="primary" onClick={() => handleSave()} className="rounded hover:bg-green-700">
            Submit Data
          </Button>
        </>
      ) : (
        <Button type="primary" onClick={() => setEditorToggle(!editorToggle)}>
          Add Topics
        </Button>
      )}

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {topicsList.map((each) => {
          return (
            <>
              <Card style={{ width: "300px" }} actions={[<EditOutlined />, <DeleteFilled />]}>
                <Card.Meta title={each.title} description={parse(each.content)} />
              </Card>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default QuillEditor;
