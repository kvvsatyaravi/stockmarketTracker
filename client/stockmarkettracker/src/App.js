import logo from "./logo.svg";
import "./App.css";

function App() {
  function MutualFundTracker() {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    function FetchAllStocksData() {
      return fetch(
        "https://www.ksrk3.in/stockmarketTrackerApis/api/allStocksData/",
        requestOptions
      );
    }

    FetchAllStocksData()
      .then((res) => res.json())
      .then((AllStocksData) => {
        fetch(
          "https://www.ksrk3.in/stockmarketTrackerApis/api/getMutualFundData/",
          requestOptions
        )
          .then((response) => response.json())
          .then((result) => {
            var stocksNames = [];
            var stocksSelected = [];
            // result.data.forEach((eachStock) => {
            //   stocksNames.push(eachStock["Stock Invested in"]);
            // });
            let bseFilteredData;
            let nseFilteredData;

            result.data.forEach((eachStock)=>{
              
            bseFilteredData = AllStocksData.data["bseData"].filter(
              (stock) => {
              
                if (eachStock) {
                  stocksSelected.push(stock["Name"]);
                  return stock;
                }
              }
            );

            nseFilteredData = AllStocksData.data["nseData"].filter(
              (stock) => {
                if (
                  stocksNames.includes(stock["Name"]) &&
                  !stocksSelected.includes(stock["Name"])
                ) {
                  // stocksSelected.push(stock["Name"])
                  return stock;
                }
              }
            );
          })


            var filteredData = bseFilteredData.concat(nseFilteredData);

            let totalChg = filteredData.reduce((acc, currentVal) => {
              return (
                acc +
                parseFloat(currentVal["%Chg"]) *
                  parseFloat(currentVal["% of Total Holdings"])
              );
            }, 0);

            console.log(totalChg);
          });
      })

      .catch((error) => console.error(error));
  }

  MutualFundTracker();
  return <div className="App"></div>;
}

export default App;
