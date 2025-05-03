import React, { useEffect, useState } from "react";

function StocksList() {
  const [StocksData, setStocksData] = useState([]);
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
      </div>
      <div style={{ height: "80%", overflow: "auto" }}>
        <table class="table table-bordered table-hover bg-white" border={0}>
          <thead class="table-light">
            <tr>
              {stocksTableDefinition.map((e) => (
                <>
                  <th style={{ width: e.width }}>{e.Label}</th>
                </>
              ))}
            </tr>
          </thead>
          <tbody>
            {stocksTableObj[activeTab].map((eachStock) => (
              <tr>
                {stocksTableDefinition.map((e) => (
                  <>
                    <td>{eachStock[e.field]}</td>
                  </>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default StocksList;
