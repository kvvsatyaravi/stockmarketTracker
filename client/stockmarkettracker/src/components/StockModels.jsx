import React, { useState, useEffect, useMemo } from "react";
import { Modal, Form, Input, Select, Button, Row, Col, Typography } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useGetApiData, stocksOperations, showToast } from "./commonUtils";

const { Option } = Select;
const { Title } = Typography;

const AddStockModal = ({ visible, onClose, type, selStock, allStocksData }) => {
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
    if (selStock) {
      setLivePrice(selStock.CurrentPrice);
      setIntiVal({
        name: selStock.StockName,
        TargetPrice: selStock.targetPrice,
        Priority: selStock.Priority,
        investmentType: "Positional",
         TargetType: selStock.TargetType,
      });
    }
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
      if (type == "Add") {
        var stockName = stockOptions.find((e) => data.name == e.value)?.label
          ? stockOptions.find((e) => data.name == e.value)?.label
          : "-";
        var recordExist = allStocksData.some(
          (eachStock) => eachStock["StockName"] == stockName
        );
        if (!recordExist) {
          stocksOperations({
            operationType: "Add",
            recordDetails: {
              userID: 1,
              targetPrice: data.TargetPrice,
              priority: data.Priority,
              tradingType: data.investmentType,
              stockName: stockName,
            },
          }).then((e) =>
            showToast("Successfully added new stock information in database")
          );
        } else {
          showToast(
            "Successfully added new stock information in database",
            "error"
          );
        }
      } else {
        stocksOperations({
          operationType: "Edit",
          recordDetails: {
            userID: 1,
            recordID: selStock.id,
            targetPrice: data.TargetPrice,
            priority: data.Priority,
            tradingType: data.investmentType,
            stockName: data.name,
              targetType: data.TargetType,
          },
        })
          .then((e) => {
            showToast("Successfully added updated stock information");
          })
          .catch((e) => {
            showToast(
              "Some error there or record not found in database",
              "error"
            );
          });
      }
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
        onFinish={(e) => handleSubmit(e)}
        layout="horizontal"
        labelCol={{ span: 6 }}
        initialValues={intiVal}
      >
        <Form.Item
          name="name"
          label="Stock Name"
          rules={[{ required: true, message: "Please select stock" }]}
        >
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
            <Col className="col-3">{livePrice}</Col>
            <Col style={{ background: "lightgrey", borderRadius: "10px" }}>
              <ReloadOutlined
                onClick={async () => {
                  if (selStockApiUrl) getStockLivePrice(selStockApiUrl);
                  else {
                    var response = await fetch(
                      "https://www.stockmarkettracker.ksrk3.in/stockmarketTrackerApi/singleStockInfo/?fundName=" +
                        selStock.StockName
                    );
                    response = await response.json();

                    var price;
                    if (response.data) {
                      price =
                        response.data.bseprice == "-"
                          ? response.data.nsePrice
                          : response.data.bsePrice;
                      setLivePrice(price);
                    }
                  }
                }}
                style={{ color: "#fa8c16", cursor: "pointer" }}
              />
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
          name="TargetPrice"
          label="Target Price"
          rules={[{ required: true, message: "Please select Target price" }]}
        >
          <Input type="number" className="col-3" />
        </Form.Item>

        <Form.Item
          name="Priority"
          label="Priority Level"
          rules={[{ required: true, message: "Please select priority" }]}
        >
          <Select style={{ width: 120 }}>
            <Option value="High">High</Option>
            <Option value="Medium">Medium</Option>
            <Option value="Low">Low</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="TargetType"
          label="Target Type"
          rules={[{ required: true, message: "Please select Target Type" }]}
        >
          <Select style={{ width: 120 }}>
            <Option value="Buy">Buy</Option>
            <Option value="Sell">Sell</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="investmentType"
          label="Investment Type"
          rules={[{ required: true, message: "Please select investment type" }]}
        >
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
            htmlType="submit"
            type="primary"
            style={{ background: "#091A52" }}
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
            })
              .then((e) => {
                showToast(
                  "Successfully deleted stock information from database"
                );
                onClose();
              })
              .catch((e) => {
                onClose();
                showToast(
                  "Some error or record not found in database",
                  "error"
                );
              });
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
