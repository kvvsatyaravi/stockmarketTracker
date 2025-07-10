import React, { useEffect, useState } from "react";
import MutualFunds from "./MutualFunds";
import StocksList from "./StocksList";
import Topics from "./Topics";
import { Routes, Route, useNavigate } from "react-router";
import SidePanel from "./SidePanel";
import {
  StockmarketContext,
  stocksOperations,
  getCookieValue,
} from "./commonUtils";
import LoginModal from "./Login";
import { UserOutlined } from "@ant-design/icons";
import "./layout.css";

function Layout() {
  const [exchangeData, setExchangeData] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [logoutUI, SetLogoutUI] = useState(false);
  const [userId, setUserId] = useState(null);
  const Navigate = useNavigate();

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

    if (document.cookie.includes("userID")) {
      setIsLoggedIn(true);
      const id = parseInt(getCookieValue("userID"));
      setUserId(id);
    }
  }, []);

  return (
    <>
      <StockmarketContext
        value={{
          exchangeData,
          setExchangeData,
          isLoggedIn,
          setIsLoggedIn,
          userId,
        }}
      >
        <div class="container-fluid">
          <div class="row">
            <SidePanel />
            <div class="col-md-10 main-content">
              <div>
                <h3 class="mb-4 d-flex text-secondary justify-content-center">
                  StockMarket Tracker
                </h3>
                <div
                  className="login-user-icon"
                  onClick={() => SetLogoutUI(!logoutUI)}
                >
                  <UserOutlined />
                  {logoutUI && (
                    <div
                      className="logout-ui"
                      onClick={() => {
                        let allCookies = document.cookie.split(";");

                        // The "expire" attribute of every cookie is
                        // Set to "Thu, 01 Jan 1970 00:00:00 GMT"
                        for (let i = 0; i < allCookies.length; i++)
                          document.cookie =
                            allCookies[i] +
                            "=;expires=" +
                            new Date(0).toUTCString();

                        SetLogoutUI(false);
                        Navigate("/");
                      }}
                    >
                      Logout
                    </div>
                  )}
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
