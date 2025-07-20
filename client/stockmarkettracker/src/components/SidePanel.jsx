import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router";

function SidePanel() {
  const [selectedOption, setSelectedOption] = useState("/StocksList");
  const PanelOptions = [
    {
      label: "📈 Stocks List",
      route: "/StocksList",
    },
    {
      label: "📊 Mutual Funds",
      route: "/MutualFunds",
    },
    {
      label: "📋 Topics",
      route: "/Topics",
    },
  ];
  let location = useLocation();

  useEffect(() => {
    // console.log(location.pathname);
    setSelectedOption(location.pathname)
  }, []);

  return (
    <div class="col-md-2 sidebar">
      <ul class="nav flex-column">
        {PanelOptions.map((eachOption) => (
          <Link style={{ textDecoration: "none" }} to={eachOption.route}>
            <li class="nav-item mb-2">
              <div
                className={
                  "nav-link " +
                  (selectedOption === eachOption.route ? "active" : "")
                }
                onClick={() => setSelectedOption(eachOption.route)}
              >
                {eachOption.label}
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}

export default SidePanel;
