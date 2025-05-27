import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import { message, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

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

const stocksOperations = (body) => {
  return fetch(
    "https://www.stockmarkettracker.ksrk3.in/stockmarketTrackerApi/stocksOperations/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((responseData) => {
      console.log("Success:", responseData);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const showToast = (message) => {
  toast.success(message);
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

export {
  useGetApiData,
  StockmarketContext,
  Exchanges,
  Loader,
  stocksOperations,
  showToast,
};
