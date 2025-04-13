import React, { useEffect, useState, useMemo } from "react";
import { Select } from "antd";
import useGetApiData from "./useGetApiData";

function MutualFunds() {
  const [fundOptions, setFundOptions] = useState([]);
  const [searchValue, SetSearchValue] = useState("");
  const [selectedFunds,setSelectedFunds] = useState([]);

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

  return (
    <div className="container">
      <div className="row d-flex justify-content-center">
        <Select
          mode="tags"
          placeholder="Please select"
          onSelect={(evt)=>{
            setSelectedFunds(selectedFunds.concat(evt))
          }}
          onInputKeyDown={(evt) => {
            console.log(evt.target.value);
            setTimeout(() => {
              SetSearchValue(evt.target.value);
            }, 2000);
          }}
          style={{ width: "45%" }}
          options={fundOptions}
        />
        <button type="button" className="secondary-color col-2 btn btn-primary">
          Analyze
        </button>
      </div>
    </div>
  );
}

export default MutualFunds;
