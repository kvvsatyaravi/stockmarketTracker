import React, { useEffect, useState } from "react";
import MutualFunds from "./MutualFunds";
import StocksList from "./StocksList";
import Topics from "./Topics";
import Checklists from "./CheckLists";
import { Routes, Route, Navigate } from "react-router";
import SidePanel from "./SidePanel";
import { StockmarketContext, stocksOperations } from "./commonUtils";
import LoginModal from "./Login";
import { UserOutlined } from "@ant-design/icons";
import "./layout.css";

function Layout() {
  const [exchangeData, setExchangeData] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function FetchAllStocksData() {
    var exchangesDataResponses = [];
    [
      "https://www.stockmarkettracker.ksrk3.in/stockmarketTrackerApi/getNSEData/",
      "https://www.stockmarkettracker.ksrk3.in/stockmarketTrackerApi/getBSEData/",
    ].forEach((e) => {
      var response = fetch(e).then((e) => e.json());
      exchangesDataResponses.push(response);
    });
    Promise.all(exchangesDataResponses)
      .then((AllStocksData) => {
        var filteredData = [];
        console.log(AllStocksData);
        setExchangeData(AllStocksData);
      })
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    FetchAllStocksData();
  }, []);

  return (
    <>
      <StockmarketContext
        value={{ exchangeData, setExchangeData, isLoggedIn, setIsLoggedIn }}
      >
        <div class="container-fluid">
          <div class="row">
            <SidePanel />
            <div class="col-md-10 main-content">
              <div>
                <h3 class="mb-4 d-flex text-secondary justify-content-center">
                  StockMarket Tracker
                </h3>
                <div>
                  <UserOutlined />
                </div>
              </div>

              <Routes>
                <Route
                  index
                  element={
                    document.cookie.includes("userID") ? (
                      <StocksList />
                    ) : (
                      <LoginModal visible={true} />
                    )
                  }
                />
                <Route path="/StocksList" element={<StocksList />} />
                <Route path="/MutualFunds" element={<MutualFunds />} />
                <Route path="/Checklists" element={<Checklists />} />
                <Route path="/Topics" element={<Topics />} />
              </Routes>
            </div>
          </div>
        </div>
      </StockmarketContext>
    </>
  );
}

export default Layout;
