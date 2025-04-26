import React, { useEffect, useState, useMemo } from "react";
import { Select } from "antd";
import { useGetApiData } from "./commonUtils";

const MutualFunds = () => {
  const [fundOptions, setFundOptions] = useState([]);
  const [searchValue, SetSearchValue] = useState("");
  const [selectedFunds, setSelectedFunds] = useState([]);
  const [fundsApiData, setFundsApiData] = useState([]);
  const [avgApiData, setAvgApiData] = useState([]);

  const TableDefinition = [
    {
      label: "Name",
      field: "",
    },
    {
      label: "1 Month",
      field: "1 Month",
    },
    {
      label: "3 Month",
      field: "3 Month",
    },
    {
      label: "6 Month",
      field: "6 Month",
    },
    {
      label: "1 Year",
      field: "1 Year",
    },
    {
      label: "3 Year",
      field: "3 Year",
    },
    {
      label: "5 Year",
      field: "5 Year",
    },
    {
      label: "10 Year",
      field: "10 Year",
    },
  ];

  const fundsPerformanceData = () => {
    const fundsUrls = [];
    const fundsApiResponse = [];
    const fundsData = [];
    var fundsOrder = [];
    // setFundOptions([]);

    selectedFunds.forEach((e) => {
      console.log(e);
      if (e.includes("www.moneycontrol.com")) {
        var fundStr = e.replace(
          "https://www.moneycontrol.com/mutual-funds/nav/",
          ""
        );
        fundStr = fundStr.split("/");
        var Name = fundStr[0];
        var id = fundStr[1];
        fundsUrls.push(
          "https://www.stockmarkettracker.ksrk3.in/stockmarketTrackerApi/mutualFundReturnData/?fundName=" +
            Name +
            "&fundid=" +
            id
        );
        fundsOrder.push(e);
      }
    });
    console.log(fundsUrls);

    fundsUrls.forEach((eachFund) => {
      fundsApiResponse.push(fetch(eachFund).then((e) => e.json()));
    });

    Promise.all(fundsApiResponse).then((responses) => {
      responses.forEach((each, index) => {
        fundsData.push({ ...each, url: fundsOrder[index] });
      });
      console.log(fundsData);
      setFundsApiData(fundsData);
    });
  };

  const { response, loading, error } = useGetApiData({
    method: "get",
    url:
      "https://www.stockmarkettracker.ksrk3.in/stockmarketTrackerApi/searchSuggestion?fundName=" +
      searchValue,
  });

  useEffect(() => {
    console.log(response);
    if (response) {
      var searchResponseData = response.data.map((eachFund) => {
        return {
          label: eachFund.name,
          value: eachFund.link_src,
        };
      });
      setFundOptions(searchResponseData);
    }
  }, [response]);

  useEffect(() => {
    if (fundsApiData.length > 0) {
      var total = [];
      TableDefinition.forEach((eachPeriod) => {
        let avgVal = 0;
        if (eachPeriod.field != "") {
          fundsApiData.forEach((eachFundData) => {
            var val;
            if (eachPeriod.label.includes("Year"))
              val = ["-", undefined].includes(
                eachFundData.data[eachPeriod.label]?.["Annualised Returns"]
              )
                ? 0
                : eachFundData.data[eachPeriod.label]["Annualised Returns"];
            else
              val = ["-", undefined].includes(
                eachFundData.data[eachPeriod.label]?.["Absolute Returns"]
              )
                ? 0
                : eachFundData.data[eachPeriod.label]["Absolute Returns"];

            avgVal = parseFloat(val) + avgVal;
          });

          avgVal = avgVal / fundsApiData.length;
          total.push(avgVal.toFixed(2) + "%");
        }
      });
      console.log(total);
      total.unshift("Total");
      setAvgApiData(total);
    }
  }, [fundsApiData]);

  return (
    <div className="container">
      <div className="row d-flex justify-content-center">
        <Select
        className="col-8"
          mode="tags"
          maxTagTextLength="10"
          maxCount="5"
          placeholder="Please select"
          onSelect={(evt) => {
            setSelectedFunds(selectedFunds.concat(evt));
          }}
          onKeyUp={(evt) => {
            console.log(evt.target.value);
            SetSearchValue(evt.target.value);
          }}
          onDeselect={(evt) => {
            console.log(evt);
            setFundsApiData(fundsApiData.filter((e) => e.url != evt));
            setSelectedFunds(selectedFunds.filter((e) => e != evt));
          }}
          style={{ width: "45%" }}
          options={fundOptions}
        />
        <button
          type="button"
          className="secondary-color col-1 btn btn-primary"
          onClick={() => fundsPerformanceData()}
        >
          Analyze
        </button>
      </div>
      <div className="row d-flex justify-content-center">
        <div className="mb-2">
          <b>Performance</b>
        </div>
        <div style={{ height: "80%", overflow: "auto" }}>
          <table class="table table-bordered table-hover bg-white">
            <thead class="table-light">
              <tr>
                {TableDefinition.map((eachPeriod) => (
                  <>
                    <th>{eachPeriod.label}</th>
                  </>
                ))}
              </tr>
            </thead>
            <tbody>
              {fundsApiData &&
                fundsApiData.map((eachFund, index) => (
                  <tr>
                    {TableDefinition.map((eachPeriod) => {
                      const selFunds = selectedFunds;
                      if (selFunds[index]) {
                        if (eachPeriod.label == "Name") {
                          var fundStr = selFunds[index].replace(
                            "https://www.moneycontrol.com/mutual-funds/nav/",
                            ""
                          );
                          fundStr = fundStr.split("/");
                          var Name = fundStr[0];
                          return <td>{Name.replaceAll("-", " ")}</td>;
                        } else {
                          return (
                            <td>
                              {eachPeriod.field.includes("Year")
                                ? eachFund.data[eachPeriod.field]?.[
                                    "Annualised Returns"
                                  ]
                                : eachFund.data[eachPeriod.field]?.[
                                    "Absolute Returns"
                                  ]}
                            </td>
                          );
                        }
                      }
                    })}
                  </tr>
                ))}
            </tbody>
          </table>

          <div className="mb-2">
            <b>Average CAGR</b>
          </div>
          <table class="table table-bordered table-hover bg-white">
            <thead class="table-light">
              <tr>
                {TableDefinition.map((eachPeriod) => (
                  <>
                    <th>
                      {eachPeriod.label == "Name" ? "" : eachPeriod.label}
                    </th>
                  </>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {avgApiData && avgApiData.map((val, index) => <td>{val}</td>)}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MutualFunds;
