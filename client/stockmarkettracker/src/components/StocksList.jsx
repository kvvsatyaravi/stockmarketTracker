import React, { useEffect, useState, useRef, useMemo, useContext } from "react";
import { Button, Select, Input } from "antd";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { stocksOperations, Exchanges } from "./commonUtils";
import { AddStockModal, DeleteStockModal } from "./StockModels";
import { ToastContainer } from "react-toastify";

function StocksList() {
  const { exchangeData, isLoggedIn } = useContext(Exchanges);
  const [stocksTableObj, setStocksTableObj] = useState({
    "All Stocks": [],
    "Buy Targets": [],
    "Sell Targets": [],
  });
  const [activeTab, setActiveTab] = useState("All Stocks");
  const [Toggle, setToggle] = useState({
    add: false,
    delete: false,
    edit: false,
  });
  const selStock = useRef({});
  const prevData = useRef({});
  const [tradeType, setTradeType] = useState("Positional Trading");

  const stocksTableDefinition = [
    {
      field: "StockName",
      Label: "name",
      width: "15%",
    },
    {
      Label: "Add/Edit",
      field: "EditDate",
      width: "15%",
    },
    {
      field: "CurrentPrice",
      Label: "Current Price",
      width: "15%",
    },
    {
      field: "targetPrice",
      Label: "Target Price",
      width: "10%",
    },
    {
      field: "TargetType",
      Label: "Target Type",
      width: "15%",
    },
    {
      field: "Priority",
      Label: "Priority",
      width: "10%",
    },
    {
      Label: "Change Difference",
      field: "ChangeDiff",
      width: "15%",
    },
    {
      format: "edit",
      Label: "Edit",
      width: "12%",
    },
    {
      format: "delete",
      Label: "Delete",
      width: "15%",
    },
  ];

  const getStocksInfo = () => {
    stocksOperations({
      operationType: "Retrive",
      recordDetails: "",
    }).then(async (result) => {
      console.log(result);
      var dataArr = [];
      var exchangesData = exchangeData;
      for (let i = 0; i < result.data.length; i++) {
        var details = result.data[i];
        if (
          exchangesData[0].nse.data[details["StockName"]] ||
          exchangesData[1].bse.data[details["StockName"]]
        ) {
          var data =
            exchangesData[0].nse.data[details["StockName"]] ||
            exchangesData[1].bse.data[details["StockName"]];
          dataArr.push({
            id: details.id,
            StockName: details["StockName"],
            EditDate: details.EditDate,
            CurrentPrice: data.LTP,
            targetPrice: details.targetPrice,
            Priority: details.Priority,
             TargetType: details.TargetType,
            ChangeDiff: (
              parseFloat(details.targetPrice) - parseFloat(data.LTP)
            ).toFixed(2),
          });
        } else {
          var bseStocksFilter = Object.keys(exchangesData[1].bse.data).filter(
            (e) => details["StockName"].includes(e)
          );
          var nseStocksFilter = Object.keys(exchangesData[0].nse.data).filter(
            (e) => details["StockName"].includes(e)
          );

          if (bseStocksFilter.length || nseStocksFilter.length) {
            var stockKey = bseStocksFilter[0] || nseStocksFilter[0];
            var stockInfo =
              exchangesData[0].nse.data[stockKey] ||
              exchangesData[1].bse.data[stockKey];
            dataArr.push({
              id: details.id,
              StockName: details["StockName"],
              EditDate: details.EditDate,
              CurrentPrice: stockInfo.LTP,
              targetPrice: details.targetPrice,
              Priority: details.Priority,
               TargetType: details.TargetType,
              ChangeDiff: (
                parseFloat(details.targetPrice) - parseFloat(stockInfo.LTP)
              ).toFixed(2),
            });
          } else {
            var response = await fetch(
              "https://www.stockmarkettracker.ksrk3.in/stockmarketTrackerApi/singleStockInfo/?fundName=" +
                details["StockName"]
            );
            response = await response.json();

            var price;
            if (response.data) {
              price =
                response.data.bseprice == "-"
                  ? response.data.nsePrice
                  : response.data.bsePrice;
            }
            dataArr.push({
              id: details.id,
              StockName: details["StockName"],
              EditDate: details.EditDate,
              CurrentPrice: price,
              targetPrice: details.targetPrice,
              Priority: details.Priority,
               TargetType: details.TargetType,
              ChangeDiff: (
                parseFloat(details.targetPrice) - parseFloat(price)
              ).toFixed(2),
            });
          }
        }
      }

       setStocksTableObj({
        "All Stocks": dataArr,
        "Buy Targets": dataArr.filter((e) => e.TargetType == "Buy"),
        "Sell Targets": dataArr.filter((e) => e.TargetType == "Sell"),
      });
      prevData.current = dataArr;
    });
  };

  useMemo(() => {
    if (exchangeData && exchangeData.length) getStocksInfo();
  }, [exchangeData]);

  const toogleModal = (name, toggle) => {
    setToggle((prev) => {
      var initialValues = { add: false, delete: false, edit: false };
      initialValues[name] = toggle;
      return initialValues;
    });
  };

   const searchStocks = (evt) => {
    setStocksTableObj((oldObj) => {
      const filterData = prevData.current.filter((e) => {
 return e.StockName.lowerCase().includes(evt.target.value.lowerCase());
      });
      return {
        "All Stocks": filterData,
        "Buy Targets": filterData.filter((e) => e.TargetType == "Buy"),
        "Sell Targets": filterData.filter((e) => e.TargetType == "Sell"),
      };
    });
  };

  return (
    <>
        {isLoggedIn ? (
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
                  <b className="stocks-tabs-number">
                    {stocksTableObj[eachTab].length}
                  </b>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "15px" }}>
              <Button
                style={{ background: "rgb(65 101 210)" }}
                onClick={() => {}}
              >
                <ReloadOutlined style={{ color: "white" }} />
              </Button>

              <Button onClick={() => toogleModal("add", true)}>
                <PlusOutlined />
              </Button>
              <Input placeholder="Search Stocks" onBlur={searchStocks} prefix={<SearchOutlined />} />
              <DropdownButton
                id="dropdown-shocks-button"
                title="Positional trading"
                size="sm"
              >
                <Dropdown.Item href="#/action-1">
                  Positional trading
                </Dropdown.Item>
                <Dropdown.Item href="#/action-3">Investment</Dropdown.Item>
              </DropdownButton>
            </div>
            </div>

            <div style={{ height: "80%", overflow: "auto" }}>
              <table
                class="table table-bordered table-hover bg-white"
                border={0}
              >
                <thead class="table-light">
                  <tr className="text-center">
                    {stocksTableObj[activeTab].length
                      ? stocksTableDefinition.map((e) => (
                          <>
                            <th style={{ width: e.width }}>{e.Label}</th>
                          </>
                        ))
                      : ""}
                  </tr>
                </thead>
                <tbody>
                  {stocksTableObj[activeTab].length
                    ? stocksTableObj[activeTab].map((eachStock) => (
                        <tr>
                          {stocksTableDefinition.map((e) =>
                            e.format ? (
                              e.format == "edit" ? (
                                <>
                                  <td
                                    className="text-center"
                                    type="primary"
                                    onClick={() => {
                                      selStock.current = eachStock;
                                      toogleModal("edit", true);
                                    }}
                                  >
                                    <EditOutlined />
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td
                                    className="text-center"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      selStock.current = eachStock;
                                      toogleModal("delete", true);
                                    }}
                                  >
                                    <DeleteOutlined />
                                  </td>
                                </>
                              )
                            ) : (
                              <>
                                <td className="text-center">
                                  {eachStock[e.field]}
                                </td>
                              </>
                            )
                          )}
                        </tr>
                      ))
                    : ""}
                </tbody>
              </table>

              <ToastContainer />
              {Toggle.add && (
                <AddStockModal
                  allStocksData={stocksTableObj["All Stocks"]}
                  visible={Toggle.add}
                  onClose={() => {
                    toogleModal("add", false);
                    setTimeout(() => {
                      getStocksInfo();
                    }, 1000);
                  }}
                  type="Add"
                />
              )}
              {Toggle.edit && (
                <AddStockModal
                  visible={Toggle.edit}
                  selStock={selStock.current}
                  onClose={() => {
                    toogleModal("edit", false);
                    setTimeout(() => {
                      getStocksInfo();
                    }, 1000);
                  }}
                  type="Edit"
                />
              )}
              {Toggle.delete && (
                <DeleteStockModal
                  selStock={selStock.current}
                  visible={Toggle.delete}
                  onClose={() => {
                    toogleModal("delete", false);
                    setTimeout(() => {
                      getStocksInfo();
                    }, 1000);
                  }}
                />
              )}
            </div>
          </>
        ) : (
          <div
            className="d-flex justify-content-center "
            style={{
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <img src={require("../Loginui.jpg")} height={500} width={500} />
            <h4>Login is required</h4>
          </div>
        )}
    </>
  );
}

export default StocksList;
