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
            var filteredData = [];

            result.data.forEach((eachStock)=>{
              if(AllStocksData.data["bseData"][eachStock['Stock Invested in']]){
                var temp = AllStocksData.data["bseData"][eachStock['Stock Invested in']];
                temp['totalHolding'] =  eachStock['% of Total Holdings']
                filteredData.push(temp);
              }
              else if(AllStocksData.data["nseData"][eachStock['Stock Invested in']]){
                var temp = AllStocksData.data["nseData"][eachStock['Stock Invested in']];
                temp['totalHolding'] =  eachStock['% of Total Holdings']
                filteredData.push(temp);
              }
          })



            let totalChg = filteredData.reduce((acc, currentVal) => {
              return (
                acc +parseFloat(currentVal["totalHolding"])
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
