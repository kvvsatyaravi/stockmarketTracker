import React, { useEffect, useState } from "react";

function Layout() {
  const [StocksData, setStocksData] = useState([]);

  const stocksTableDefinition = [
    {
      field: "Name",
      Label: "Name",
    },
    {
      Label: "Price",
      field: "LTP",
    },
    {
      field: "%Chg",
      Label: "Change",
    }
    
  ];

  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  function FetchAllStocksData() {
    return fetch(
      "https://www.ksrk3.in/stockmarketTrackerApi/api/allStocksData/",
      requestOptions
    )
      .then((res) => res.json())
      .then((AllStocksData) => {
        var filteredData = [];
        console.log(AllStocksData);
        Object.keys(AllStocksData.data["bseData"]).forEach((eachStock) => {
          filteredData.push(AllStocksData.data["bseData"][eachStock]);
        });

        console.log(filteredData);
        setStocksData(filteredData);
      })
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    FetchAllStocksData();
  }, []);

  return (
    <>
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-2 sidebar">
            <ul class="nav flex-column">
              <li class="nav-item mb-2">
                <a class="nav-link active" href="#">
                  📈 Stocks List
                </a>
              </li>
              <li class="nav-item mb-2">
                <a class="nav-link" href="#">
                  ⚙️ Stocks Filter
                </a>
              </li>
              <li class="nav-item mb-2">
                <a class="nav-link" href="#">
                  📊 Mutual Funds
                </a>
              </li>
              <li class="nav-item mb-2">
                <a class="nav-link" href="#">
                  ☑️ Check List
                </a>
              </li>
              <li class="nav-item mb-2">
                <a class="nav-link" href="#">
                  📋 Topics
                </a>
              </li>
            </ul>
          </div>

          <div class="col-md-10 main-content">
            <h3 class="mb-4 text-secondary">StockMarket Tracker</h3>

            <div class="d-flex justify-content-between mb-3">
              <div>
                <ul class="nav nav-tabs">
                  <li class="nav-item">
                    <a class="nav-link active" href="#">
                      All Stocks <span class="badge bg-primary">10</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#">
                      Near Targets
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#">
                      Far Targets
                    </a>
                  </li>
                </ul>
              </div>
              {/* <div class="d-flex">
          <input class="form-control me-2" type="search" placeholder="Stock Name">
          <button class="btn btn-warning">Positional Trading</button>
        </div> */}
            </div>
            <div style={{height:'80%',overflow:'auto'}}>
              <table class="table table-bordered table-hover bg-white">
                <thead class="table-light">
                  <tr>
                    <th>Name</th>
                    {/* <th>Add/Edit Date</th> */}
                    <th>Current Price</th>
                    {/* <th>Target Price</th>
                  <th>Priority</th> */}
                    <th>Change Diff</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {StocksData.map((eachStock) => (
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
          </div>
        </div>
      </div>
    </>
  );
}

export default Layout;
