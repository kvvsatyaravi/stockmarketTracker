import React, { useEffect, useState, useRef } from "react";
import { Button, Select, Input } from "antd";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { EditOutlined, DeleteOutlined, PlusOutlined,SearchOutlined } from "@ant-design/icons";
import { AddStockModal, DeleteStockModal } from "./StockModels";

function StocksList() {
  const [StocksData, setStocksData] = useState([]);
  const [Toggle, setToggle] = useState({
    add: false,
    delete: false,
    edit: false,
  });
  const [stocksTableObj, setStocksTableObj] = useState({
    "All Stocks": [
      {
        name: "bse",
        "Add/Edit": "12-03-22",
        CurrentPrice: 1234,
        TargetPrice: 4332,
        Priority: "Medium",
        ChangeDiff: 10,
      },
      {
        name: "nse",
        "Add/Edit": "12-03-22",
        CurrentPrice: 1234,
        TargetPrice: 4332,
        Priority: "High",
        ChangeDiff: 10,
      },
      {
        name: "bse",
        "Add/Edit": "12-03-22",
        CurrentPrice: 1234,
        TargetPrice: 4332,
        Priority: "Medium",
        ChangeDiff: 10,
      },
      {
        name: "nse",
        "Add/Edit": "12-03-22",
        CurrentPrice: 1234,
        TargetPrice: 4332,
        Priority: "High",
        ChangeDiff: 10,
      },
    ],
    "Near Targets": [
      {
        name: "bse",
        "Add/Edit": "12-03-22",
        CurrentPrice: 1234,
        TargetPrice: 4332,
        Priority: "Medium",
        ChangeDiff: 10,
      },
      {
        name: "nse",
        "Add/Edit": "12-03-22",
        CurrentPrice: 1234,
        TargetPrice: 4332,
        Priority: "High",
        ChangeDiff: 10,
      },
    ],
    "Far Targets": [
      {
        name: "nse",
        "Add/Edit": "12-03-22",
        CurrentPrice: 1234,
        TargetPrice: 4332,
        Priority: "High",
        ChangeDiff: 10,
      },
    ],
  });
  const [activeTab, setActiveTab] = useState("All Stocks");
  const selStock = useRef({});

  const stocksTableDefinition = [
    {
      field: "name",
      Label: "Name",
      width: "15%",
    },
    {
      Label: "Add/Edit",
      field: "Add/Edit",
      width: "15%",
    },
    {
      field: "CurrentPrice",
      Label: "Current Price",
      width: "15%",
    },
    {
      field: "TargetPrice",
      Label: "Target Price",
      width: "15%",
    },
    {
      field: "Priority",
      Label: "Priority",
      width: "15%",
    },
    {
      field: "ChangeDiff",
      Label: "Change Difference",
      width: "15%",
    },
    {
      Label: "Modify",
      format: "edit",
      width: "5%",
    },
    {
      Label: "Delete",
      format: "delete",
      width: "5%",
    },
  ];

  useEffect(() => {
    // setStocksTableObj({
    //   "All Stocks": [
    //     {
    //       name: "bse",
    //       "Add/Edit": "12-03-22",
    //       CurrentPrice: 1234,
    //       TargetPrice: 4332,
    //       Priority: "Medium",
    //       ChangeDiff: 10,
    //     },
    //     {
    //       name: "nse",
    //       "Add/Edit": "12-03-22",
    //       CurrentPrice: 1234,
    //       TargetPrice: 4332,
    //       Priority: "High",
    //       ChangeDiff: 10,
    //     },
    //     {
    //       name: "bse",
    //       "Add/Edit": "12-03-22",
    //       CurrentPrice: 1234,
    //       TargetPrice: 4332,
    //       Priority: "Medium",
    //       ChangeDiff: 10,
    //     },
    //     {
    //       name: "nse",
    //       "Add/Edit": "12-03-22",
    //       CurrentPrice: 1234,
    //       TargetPrice: 4332,
    //       Priority: "High",
    //       ChangeDiff: 10,
    //     },
    //   ],
    //   "Near Targets": [
    //     {
    //       name: "bse",
    //       "Add/Edit": "12-03-22",
    //       CurrentPrice: 1234,
    //       TargetPrice: 4332,
    //       Priority: "Medium",
    //       ChangeDiff: 10,
    //     },
    //     {
    //       name: "nse",
    //       "Add/Edit": "12-03-22",
    //       CurrentPrice: 1234,
    //       TargetPrice: 4332,
    //       Priority: "High",
    //       ChangeDiff: 10,
    //     },
    //   ],
    //   "Far Targets": [
    //     {
    //       name: "nse",
    //       "Add/Edit": "12-03-22",
    //       CurrentPrice: 1234,
    //       TargetPrice: 4332,
    //       Priority: "High",
    //       ChangeDiff: 10,
    //     },
    //   ],
    // });
  }, []);

  const toogleModal = (name, toggle) => {
    setToggle((prev) => {
      var initialValues = { add: false, delete: false, edit: false };
      initialValues[name] = toggle;
      return initialValues;
    });
  };

  const handleChange = (value) => {
    console.log(value); // { value: "lucy", key: "lucy", label: "Lucy (101)" }
  };

  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  return (
    <>
      <div class="d-flex justify-content-between mb-3">
        <div className="stockslist-tabs justify-content-between">
          {Object.keys(stocksTableObj).map((eachTab) => (
            <div
              className={
                "stocks-tabs " + (eachTab == activeTab ? "active-tab" : "")
              }
              onClick={() => {
                setActiveTab(eachTab);
              }}
            >
              <b>{eachTab}</b>
              <b className="stocks-tabs-number">{15}</b>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "15px" }}>
          <Button onClick={() => toogleModal("add", true)}>
            <PlusOutlined />
          </Button>
          <Input
            placeholder="Search Stocks"
            prefix={<SearchOutlined />}
            
          />
          <DropdownButton
            id="dropdown-shocks-button"
            title="Positional trading"
            size="sm"
          >
            <Dropdown.Item href="#/action-1">Positional trading</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Investment</Dropdown.Item>
          </DropdownButton>
        </div>
      </div>
      <div style={{ height: "80%", overflow: "auto" }}>
        <table class="table table-bordered table-hover bg-white" border={0}>
          <thead class="table-light">
            <tr>
              {stocksTableDefinition.map((e) => (
                <>
                  <th className="text-center" style={{ width: e.width }}>
                    {e.Label}
                  </th>
                </>
              ))}
            </tr>
          </thead>
          <tbody>
            {stocksTableObj[activeTab].map((eachStock) => (
              <tr>
                {stocksTableDefinition.map((e) =>
                  e.format ? (
                    e.format == "edit" ? (
                      <>
                        <td
                          className="text-center"
                          style={{ cursor: "pointer" }}
                          onClick={() => toogleModal("edit", true)}
                        >
                          <EditOutlined />
                        </td>
                      </>
                    ) : (
                      <>
                        <td
                          className="text-center"
                          style={{ cursor: "pointer" }}
                          onClick={() => toogleModal("delete", true)}
                        >
                          <DeleteOutlined />
                        </td>
                      </>
                    )
                  ) : (
                    <>
                      <td className="text-center">{eachStock[e.field]}</td>
                    </>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>

        <AddStockModal
          visible={Toggle.add}
          onClose={() => toogleModal("add", false)}
          type="Add"
        />
        <AddStockModal
          visible={Toggle.edit}
          selStock={selStock.current}
          onClose={() => toogleModal("edit", false)}
          type="Edit"
        />
        <DeleteStockModal
          visible={Toggle.delete}
          onClose={() => toogleModal("delete", false)}
        />
      </div>
    </>
  );
}

export default StocksList;
