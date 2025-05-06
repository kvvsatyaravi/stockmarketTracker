import React, { useEffect, useState } from "react";
import { Select } from "antd";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { AddStockModal, DeleteStockModal } from "./StockModels";

function StocksList() {
  const [StocksData, setStocksData] = useState([]);
  const [AddModelToggle, setAddModelToggle] = useState(false);
  const [deleteModelToggle, setDeleteModelToggle] = useState(false);
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
          <Select
            labelInValue
            defaultValue={{ value: "lucy", label: "Lucy (101)" }}
            style={{ width: 120 }}
            onChange={handleChange}
            options={[
              {
                value: "jack",
                label: "Jack (100)",
              },
              {
                value: "lucy",
                label: "Lucy (101)",
              },
            ]}
          />
          <DropdownButton
            id="dropdown-shocks-button"
            title="positional trading"
            size="sm"
          >
            <Dropdown.Item href="#/action-1">positional trading</Dropdown.Item>
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
                          onClick={() => setAddModelToggle(!AddModelToggle)}
                        >
                          <EditOutlined />
                        </td>
                      </>
                    ) : (
                      <>
                        <td
                          className="text-center"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            setDeleteModelToggle(!deleteModelToggle)
                          }
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
          visible={AddModelToggle}
          onClose={() => setAddModelToggle(!AddModelToggle)}
        />

        <DeleteStockModal
          visible={deleteModelToggle}
          onClose={() => setDeleteModelToggle(!deleteModelToggle)}
        />
      </div>
    </>
  );
}

export default StocksList;
