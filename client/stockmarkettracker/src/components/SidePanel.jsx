import React, { useState } from "react";
import { Link } from "react-router";

function SidePanel() {
  const [selectedOption, setSelectedOption] = useState("/StocksList");
  return (
    <div class="col-md-2 sidebar">
      <ul class="nav flex-column">
        <Link style={{ textDecoration: "none" }} to="/StocksList">
          <li class="nav-item mb-2">
            <div className="nav-link active">📈 Stocks List</div>
          </li>
        </Link>
        <Link style={{ textDecoration: "none" }} to="/MutualFunds">
          <li class="nav-item mb-2">
            <div className="nav-link">📊 Mutual Funds</div>
          </li>
        </Link>
        <Link style={{ textDecoration: "none" }} to="/ChecksList">
          <li class="nav-item mb-2">
            <div className="nav-link">☑️ Check List</div>
          </li>
        </Link>
        <Link style={{ textDecoration: "none" }} to="/Topics">
          <li class="nav-item mb-2">
            <div className="nav-link">📋 Topics</div>
          </li>
        </Link>
      </ul>
    </div>
  );
}

export default SidePanel;
