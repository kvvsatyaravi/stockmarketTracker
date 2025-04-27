import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const Exchanges = React.createContext({});
const StockmarketContext = Exchanges.Provider;

const Loader = () => {
  return (
    <div
      className="row d-flex justify-content-center"
      style={{ marginBlock: "20%" }}
    >
      <Spin
        indicator={<LoadingOutlined spin style={{ fontSize: 48 }} />}
        size="large"
      />
    </div>
  );
};

const useGetApiData = ({ url, method, body = null, headers = null }) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setloading] = useState(true);

  const fetchData = () => {
    axios[method](url, JSON.parse(headers), JSON.parse(body))
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setloading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [method, url, body, headers]);

  return { response, error, loading };
};

export { useGetApiData, StockmarketContext, Loader };
