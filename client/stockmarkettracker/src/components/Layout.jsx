import React, { useEffect, useState } from "react";
import MutualFunds from "./MutualFunds";
import StocksList from "./StocksList";
import Topics from "./Topics";
import Checklists from "./CheckLists";
import { Routes, Route, Navigate } from "react-router";
import SidePanel from "./SidePanel";

function Layout() {
  return (
    <>
      <div class="container-fluid">
        <div class="row">
          <SidePanel />
          <div class="col-md-10 main-content">
            <h3 class="mb-4 d-flex text-secondary justify-content-center">
              StockMarket Tracker
            </h3>
            <Routes>
              <Route index element={<Navigate replace to="/StocksList" />} />
              <Route path="/StocksList" element={<StocksList />} />
              <Route path="/MutualFunds" element={<MutualFunds />} />
              <Route path="/Checklists" element={<Checklists />} />
              <Route path="/Topics" element={<Topics />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default Layout;
