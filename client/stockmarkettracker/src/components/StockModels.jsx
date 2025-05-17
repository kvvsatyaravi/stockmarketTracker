import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Button, Row, Col, Typography } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useGetApiData } from "./commonUtils";

const { Option } = Select;
const { Title } = Typography;

const AddStockModal = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const [livePrice, setLivePrice] = useState(0);
  const [stockOptions, setStockOptions] = useState([]);
  const [searchValue, SetSearchValue] = useState("");
  const [selStockApiUrl, setSelStockApiUrl] = useState("");

  const { response, loading, error } = useGetApiData({
    method: "get",
    url:
      "https://www.stockmarkettracker.ksrk3.in/stockmarketTrackerApi/searchSuggestion?fundName=" +
      searchValue +
      "&type=1",
  });

  useEffect(() => {
    console.log(response);
    if (response) {
      var searchResponseData = response.data.map((eachFund) => {
        return {
          label: eachFund.name,
          value: eachFund.link_src,
        };
      });
      setStockOptions(searchResponseData);
    }
  }, [response]);

  const handleReset = () => {
    form.resetFields();
    setLivePrice(0);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const data = {
        ...values,
        livePrice,
      };
      console.log("Submitted:", data);
      onClose();
    });
  };

  const getStockLivePrice = (value) => {
    if (value != selStockApiUrl) setSelStockApiUrl(value);

    fetch(
      "https://www.stockmarkettracker.ksrk3.in/stockmarketTrackerApi/getStockLivePrice/?stockUrl=" +
        value
    )
      .then((e) => e.json())
      .then((e) => {
        var price;
        if (e.data) {
          price = e.data.bseprice == "-" ? e.data.nsePrice : e.data.bsePrice;
          setLivePrice(price);
        }
      });
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      title={<Title level={5}>Add / Edit Stock Details</Title>}
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 6 }}
        initialValues={{
          targetPrice: 3205.5,
          priority: "High",
          investmentType: "Positional",
        }}
      >
        <Form.Item
          name="stockName"
          label="Stock Name"
          rules={[{ required: true }]}
        >
          <Select
            showSearch
            filterOption={false}
            onKeyUp={(evt) => {
              console.log(evt.target.value);
              SetSearchValue(evt.target.value);
            }}
            onSelect={(evt) => {
              getStockLivePrice(evt);
            }}
            placeholder="Please select"
            options={stockOptions}
            style={{ width: "75%" }}
          />
        </Form.Item>

        <Form.Item label="Live Price">
          <Row align="middle" gutter={8}>
            <Col className="col-3">{livePrice}</Col>
            <Col style={{ background: "lightgrey", borderRadius: "10px" }}>
              <ReloadOutlined
                onClick={() => {
                  getStockLivePrice(selStockApiUrl);
                }}
                style={{ color: "#fa8c16", cursor: "pointer" }}
              />
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
          name="targetPrice"
          label="Target Price"
          rules={[{ required: true }]}
        >
          <Input type="number" className="col-3" />
        </Form.Item>

        <Form.Item name="priority" label="Priority Level">
          <Select style={{ width: 120 }}>
            <Option value="High">High</Option>
            <Option value="Medium">Medium</Option>
            <Option value="Low">Low</Option>
          </Select>
        </Form.Item>

        <Form.Item name="investmentType" label="Investment Type">
          <Select style={{ width: 120 }}>
            <Option value="Positional">Positional</Option>
            <Option value="Intraday">Intraday</Option>
          </Select>
        </Form.Item>

        <div className="d-flex justify-content-end gap-2 mt-3">
          <Button
            style={{ background: "#ff924c", color: "white", border: "none" }}
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            type="primary"
            style={{ background: "#091A52" }}
            onClick={handleSubmit}
          >
            Add / Edit
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

const DeleteStockModal = ({ visible, onClose }) => {
  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      title={<Title level={5}>Delete Stock Details</Title>}
    >
      <h6>Are you sure want to delete ?</h6>
      <div className="d-flex justify-content-center gap-2 mt-3">
        <Button
          className="col-2"
          type="primary"
          style={{ background: "#091A52" }}
        >
          Yes
        </Button>
        <Button
          className="col-2"
          style={{ background: "#ff924c", color: "white", border: "none" }}
        >
          No
        </Button>
      </div>
    </Modal>
  );
};
export { AddStockModal, DeleteStockModal };
