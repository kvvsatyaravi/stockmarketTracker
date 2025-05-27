import React, { useState, useEffect, useMemo } from "react";
import { Modal, Form, Input, Select, Button, Row, Col, Typography } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useGetApiData, stocksOperations, showToast } from "./commonUtils";

const { Option } = Select;
const { Title } = Typography;

const AddStockModal = ({ visible, onClose, type, selStock }) => {
  const [form] = Form.useForm();
  const [livePrice, setLivePrice] = useState(0);
  const [stockOptions, setStockOptions] = useState([]);
  const [searchValue, SetSearchValue] = useState(" ");
  const [selStockApiUrl, setSelStockApiUrl] = useState("");
  const [intiVal, setIntiVal] = useState({});

  const { response, loading, error } = useGetApiData({
    method: "get",
    url:
      "https://www.stockmarkettracker.ksrk3.in/stockmarketTrackerApi/searchSuggestion?fundName=" +
      searchValue +
      "&type=1",
  });

  useEffect(() => {
    console.log(response);
    if (
      response &&
      response.data.length &&
      response.data[0].pdt_dis_nm != "No Result Available"
    ) {
      var searchResponseData = response.data.map((eachFund) => {
        return {
          label: eachFund.name,
          value: eachFund.link_src,
        };
      });
      setStockOptions(searchResponseData);
    }
  }, [response]);

  useMemo(() => {
    if (selStock)
      setIntiVal({
        name: selStock.name,
        TargetPrice: selStock.TargetPrice,
        Priority: selStock.Priority,
        investmentType: "Positional",
      });
  }, [selStock]);

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
      stocksOperations({
        operationType: "Add",
        recordDetails: {
          userID: 1,
          targetPrice: data.TargetPrice,
          priority: data.Priority,
          tradingType: data.investmentType,
          stockName: stockOptions.find((e) => data.name == e.value)?.label
            ? stockOptions.find((e) => data.name == e.value)?.label
            : "-",
        },
      });
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
      title={<Title level={5}>{type} Stock Details</Title>}
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 6 }}
        initialValues={intiVal}
      >
        <Form.Item name="name" label="Stock Name" rules={[{ required: true }]}>
          {type == "Add" ? (
            <Select
              showSearch
              filterOption={false}
              onKeyUp={(evt) => {
                setTimeout(() => {
                  SetSearchValue(evt.target.value);
                }, 1000);
              }}
              onSelect={(evt) => {
                getStockLivePrice(evt);
              }}
              placeholder="Please select"
              options={stockOptions}
              style={{ width: "75%" }}
            />
          ) : (
            <Select
              style={{ width: "75%" }}
              suffixIcon={false}
              disabled={true}
            />
          )}
        </Form.Item>

        <Form.Item label="Live Price">
          <Row align="middle" gutter={8}>
            <Col className="col-3">{type == "Add" ? livePrice : ""}</Col>
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
          name="TargetPrice"
          label="Target Price"
          rules={[{ required: true }]}
        >
          <Input type="number" className="col-3" />
        </Form.Item>

        <Form.Item name="Priority" label="Priority Level">
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
            onClick={(e) => handleReset(e)}
          >
            Reset
          </Button>
          <Button
            type="primary"
            style={{ background: "#091A52" }}
            onClick={(e) => handleSubmit(e)}
          >
            Submit
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

const DeleteStockModal = ({ visible, onClose, selStock }) => {
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
          onClick={(e) => {
            stocksOperations({
              operationType: "Delete",
              recordDetails: {
                id: selStock.id,
              },
            });
            onClose();
          }}
        >
          Yes
        </Button>
        <Button
          className="col-2"
          onClick={() => onClose()}
          style={{ background: "#ff924c", color: "white", border: "none" }}
        >
          No
        </Button>
      </div>
    </Modal>
  );
};

export { AddStockModal, DeleteStockModal };
